<template>
  <!-- 整页 100vh 100vw，flex 横排，overflow:hidden -->
  <div class="game-root">
    <!-- 左 sidebar -->
    <SideBar
      :blind-index="blindIndex"
      :blind="currentBlind"
      :blind-score="blindScore"
      :hands-left="handsLeft"
      :discards-left="discardsLeft"
      :coins="coins"
      :round="round"
      :hand-name="lastHandName"
      :hand-chips="lastChips"
      :hand-mult="lastMult"
      @restart="handleRestart"
    />

    <!-- 右主区：3 段平均 grid，不加 padding-right -->
    <div class="main-area">
      <!-- 第 1 段：Joker 区 -->
      <JokerArea
        :owned-jokers="ownedJokers"
        :triggering-ids="triggeringJokerIds"
      />

      <!-- 第 2 段：出牌区 -->
      <PlayArea
        :played-cards="playedCards"
        :hand-name="lastHandName"
      />

      <!-- 第 3 段：手牌 + 按钮 -->
      <HandArea
        :hand="hand"
        :selected-ids="selectedIds"
        :discards-left="discardsLeft"
        :game-state="gameState"
        :deck-ref="deckRef"
        @toggle-select="toggleSelect"
        @play="handlePlay"
        @discard="handleDiscard"
        @sort-by-rank="sortByRank"
        @sort-by-suit="sortBySuit"
        @card-ref="setCardRef"
      />
    </div>

    <!-- fixed 右下牌堆 -->
    <DeckPile
      :deck-count="deck.length"
      ref="deckRef"
    />

    <!-- 商店覆盖层（state === 'shop'） -->
    <ShopView
      v-if="gameState === 'shop'"
      :shop-jokers="shopJokers"
      :coins="coins"
      :owned-jokers="ownedJokers"
      :blind-index="blindIndex"
      @buy="handleBuy"
      @skip="handleSkip"
    />

    <!-- 结束覆盖层（won / lost） -->
    <EndView
      v-if="gameState === 'won' || gameState === 'lost'"
      :state="gameState"
      :blind-index="blindIndex"
      @restart="handleRestart"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import SideBar from './components/SideBar.vue'
import JokerArea from './components/JokerArea.vue'
import PlayArea from './components/PlayArea.vue'
import HandArea from './components/HandArea.vue'
import DeckPile from './components/DeckPile.vue'
import ShopView from './components/ShopView.vue'
import EndView from './components/EndView.vue'

import { BLINDS, calcReward } from './config/blinds.js'
import { JOKERS } from './config/jokers.js'
import { HAND_SIZE, STARTING_HANDS, STARTING_DISCARDS, MAX_JOKERS } from './config/constants.js'
import { calculateScore } from './utils/scoring.js'

// ===== 状态 =====
const gameState = ref('playing') // playing / shop / won / lost

const blindIndex = ref(0)
const round = ref(1)

const blindScore = ref(0)
const handsLeft = ref(STARTING_HANDS)
const discardsLeft = ref(STARTING_DISCARDS)
const coins = ref(0)

const ownedJokers = ref([])
const shopJokers = ref([])

// 牌堆
const deck = ref([])
// 手牌：每张 { id, suit, rank, dealing(动画标志) }
const hand = ref([])
// 选中的牌 id 集合
const selectedIds = ref(new Set())
// 出牌区
const playedCards = ref([])
// 最后一手计分展示
const lastHandName = ref('')
const lastChips = ref(0)
const lastMult = ref(0)
// Joker 触发动画 id 列表
const triggeringJokerIds = ref([])

// 牌堆 DOM ref（发牌动画用）
const deckRef = ref(null)
// 手牌 card DOM refs（发牌动画用）
const cardRefs = ref({})

const currentBlind = computed(() => BLINDS[blindIndex.value])

// ===== 牌组生成 =====
function createDeck() {
  const suits = ['♠', '♥', '♦', '♣']
  const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K']
  const d = []
  let id = 0
  for (const suit of suits) {
    for (const rank of ranks) {
      d.push({ id: id++, suit, rank })
    }
  }
  return d
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ===== 发牌 =====
function dealCards(count) {
  const drawn = []
  for (let i = 0; i < count && deck.value.length > 0; i++) {
    const card = deck.value.pop()
    drawn.push({ ...card, dealing: true })
  }
  // 错峰 60ms 逐张加入手牌
  drawn.forEach((card, i) => {
    setTimeout(() => {
      hand.value.push(card)
      setTimeout(() => {
        const idx = hand.value.findIndex(c => c.id === card.id)
        if (idx !== -1) hand.value[idx].dealing = false
      }, 400)
    }, i * 60)
  })
}

// ===== 初始化 =====
function initGame() {
  deck.value = shuffle(createDeck())
  hand.value = []
  selectedIds.value = new Set()
  playedCards.value = []
  blindScore.value = 0
  handsLeft.value = STARTING_HANDS
  discardsLeft.value = STARTING_DISCARDS
  coins.value = 0
  ownedJokers.value = []
  blindIndex.value = 0
  round.value = 1
  gameState.value = 'playing'
  lastHandName.value = ''
  lastChips.value = 0
  lastMult.value = 0
  triggeringJokerIds.value = []
  dealCards(HAND_SIZE)
}

// ===== 选牌 =====
function toggleSelect(cardId) {
  if (gameState.value !== 'playing') return
  const s = new Set(selectedIds.value)
  if (s.has(cardId)) {
    s.delete(cardId)
  } else {
    if (s.size < 5) s.add(cardId)
  }
  selectedIds.value = s
}

// ===== 排序 =====
const RANK_ORDER = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']
const SUIT_ORDER = ['♠','♥','♦','♣']

function sortByRank() {
  hand.value = [...hand.value].sort((a, b) => RANK_ORDER.indexOf(a.rank) - RANK_ORDER.indexOf(b.rank))
  selectedIds.value = new Set()
}

function sortBySuit() {
  hand.value = [...hand.value].sort((a, b) => {
    const si = SUIT_ORDER.indexOf(a.suit) - SUIT_ORDER.indexOf(b.suit)
    if (si !== 0) return si
    return RANK_ORDER.indexOf(a.rank) - RANK_ORDER.indexOf(b.rank)
  })
  selectedIds.value = new Set()
}

// ===== 出牌 =====
async function handlePlay() {
  if (gameState.value !== 'playing') return
  const selected = hand.value.filter(c => selectedIds.value.has(c.id))
  if (selected.length === 0) return

  hand.value = hand.value.filter(c => !selectedIds.value.has(c.id))
  selectedIds.value = new Set()

  playedCards.value = selected

  const result = calculateScore(selected, ownedJokers.value)
  lastHandName.value = result.handName
  lastChips.value = result.chips
  lastMult.value = result.mult

  if (result.triggeredJokerIds.length > 0) {
    triggeringJokerIds.value = result.triggeredJokerIds
    setTimeout(() => { triggeringJokerIds.value = [] }, 800)
  }

  blindScore.value += result.score
  handsLeft.value -= 1

  await delay(600)
  playedCards.value = []
  dealCards(Math.min(selected.length, deck.value.length))

  if (blindScore.value >= currentBlind.value.target) {
    const reward = calcReward(handsLeft.value)
    coins.value += reward
    await delay(400)
    enterShop()
    return
  }

  if (handsLeft.value <= 0) {
    await delay(400)
    gameState.value = 'lost'
  }
}

// ===== 弃牌 =====
async function handleDiscard() {
  if (gameState.value !== 'playing') return
  if (discardsLeft.value <= 0) return
  const selected = hand.value.filter(c => selectedIds.value.has(c.id))
  if (selected.length === 0) return

  hand.value = hand.value.filter(c => !selectedIds.value.has(c.id))
  selectedIds.value = new Set()
  discardsLeft.value -= 1

  await delay(200)
  dealCards(Math.min(selected.length, deck.value.length))
}

// ===== 进商店 =====
function enterShop() {
  const available = JOKERS.filter(j => !ownedJokers.value.find(o => o.id === j.id))
  shopJokers.value = shuffle(available).slice(0, Math.min(3, available.length)).map(j => ({
    ...j,
    sold: false,
  }))
  gameState.value = 'shop'
}

// ===== 商店：购买 =====
function handleBuy(jokerId) {
  if (ownedJokers.value.length >= MAX_JOKERS) return
  const jokerDef = shopJokers.value.find(j => j.id === jokerId)
  if (!jokerDef || jokerDef.sold) return
  if (coins.value < jokerDef.price) return

  coins.value -= jokerDef.price
  const fullDef = JOKERS.find(j => j.id === jokerId)
  ownedJokers.value = [...ownedJokers.value, fullDef]
  jokerDef.sold = true
}

// ===== 商店：跳过 =====
function handleSkip() {
  const nextIndex = blindIndex.value + 1
  if (nextIndex >= BLINDS.length) {
    gameState.value = 'won'
    return
  }
  blindIndex.value = nextIndex
  round.value += 1
  blindScore.value = 0
  handsLeft.value = STARTING_HANDS
  discardsLeft.value = STARTING_DISCARDS
  lastHandName.value = ''
  lastChips.value = 0
  lastMult.value = 0
  playedCards.value = []

  deck.value = shuffle(createDeck())
  hand.value = []
  selectedIds.value = new Set()
  gameState.value = 'playing'
  dealCards(HAND_SIZE)
}

// ===== 重新开始 =====
function handleRestart() {
  initGame()
}

// ===== 工具 =====
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function setCardRef(id, el) {
  if (el) cardRefs.value[id] = el
  else delete cardRefs.value[id]
}

onMounted(() => {
  initGame()
})
</script>

<style scoped>
.game-root {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
}

.main-area {
  flex: 1;
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  min-width: 0;
  /* 不加 padding-right，否则 fixed 牌堆会浮在画布外 */
}
</style>
