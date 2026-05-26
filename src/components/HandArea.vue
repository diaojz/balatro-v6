<template>
  <!-- 第 3 段：手牌 + 按钮 -->
  <section class="hand-area">
    <!-- 标题行 -->
    <div class="hand-header">
      <span class="hand-title">手牌</span>
      <span class="hand-count">已选 {{ selectedCount }} / 5 张</span>
    </div>

    <!-- 手牌横排 -->
    <div class="hand-cards">
      <div
        v-for="card in hand"
        :key="card.id"
        class="playing-card"
        :class="{
          selected: selectedIds.has(card.id),
          dealing: card.dealing,
        }"
        @click="$emit('toggle-select', card.id)"
        :ref="el => $emit('card-ref', card.id, el)"
      >
        <!-- 左上角 -->
        <div class="card-corner top-left" :style="{ color: suitColor(card.suit) }">
          <div class="card-rank">{{ card.rank }}</div>
          <div class="card-suit-small">{{ card.suit }}</div>
        </div>
        <!-- 中央花色 -->
        <div class="card-center" :style="{ color: suitColor(card.suit) }">{{ card.suit }}</div>
        <!-- 右下角 -->
        <div class="card-corner bottom-right" :style="{ color: suitColor(card.suit) }">
          <div class="card-rank">{{ card.rank }}</div>
          <div class="card-suit-small">{{ card.suit }}</div>
        </div>
      </div>
    </div>

    <!-- 按钮行，右边留 130px 给牌堆 -->
    <div class="btn-row">
      <button
        class="px-btn px-btn-play"
        :disabled="selectedCount === 0 || gameState !== 'playing'"
        @click="$emit('play')"
      >
        出牌 ({{ selectedCount }})
      </button>
      <button
        class="px-btn px-btn-discard"
        :disabled="selectedCount === 0 || discardsLeft <= 0 || gameState !== 'playing'"
        @click="$emit('discard')"
      >
        弃牌 ({{ discardsLeft }})
      </button>
      <button class="px-btn px-btn-sort" @click="$emit('sort-by-rank')">
        按点排序
      </button>
      <button class="px-btn px-btn-sort" @click="$emit('sort-by-suit')">
        按花排序
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  hand: Array,
  selectedIds: Set,
  discardsLeft: Number,
  gameState: String,
  deckRef: Object,
})

defineEmits(['toggle-select', 'play', 'discard', 'sort-by-rank', 'sort-by-suit', 'card-ref'])

const selectedCount = computed(() => props.selectedIds?.size ?? 0)

function suitColor(suit) {
  return suit === '♥' || suit === '♦' ? 'var(--red)' : 'var(--card-edge)'
}
</script>

<style scoped>
.hand-area {
  display: flex;
  flex-direction: column;
  padding: 36px 16px 12px; /* padding-top ≥ 36px 给选中上移留余量 */
  overflow: hidden;
}

.hand-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}
.hand-title {
  font: 700 14px/1 var(--sans);
  color: var(--gold);
}
.hand-count {
  font: 700 13px/1 var(--sans);
  color: var(--muted);
}

.hand-cards {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding-bottom: 8px;
  min-height: 145px; /* 保证空时也有高度 */
}

/* 发牌进入动画 */
.dealing {
  animation: dealIn .4s ease-out;
}

.card-corner {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
}
.top-left {
  top: 6px;
  left: 7px;
}
.bottom-right {
  bottom: 6px;
  right: 7px;
  transform: rotate(180deg);
}
.card-rank {
  font: 700 14px/1 var(--sans);
}
.card-suit-small {
  font-size: 12px;
  line-height: 1;
}
.card-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 36px;
  opacity: 0.35;
  line-height: 1;
}

/* 按钮行，右边留 130px 给牌堆 */
.btn-row {
  display: flex;
  gap: 8px;
  align-items: center;
  padding-right: 130px;
  flex-wrap: wrap;
  margin-top: 8px;
}
</style>
