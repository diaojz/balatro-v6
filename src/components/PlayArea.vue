<template>
  <!-- 第 2 段：出牌区，贴段顶 -->
  <section class="play-area">
    <div class="play-header">
      <span class="play-title">出牌区</span>
      <span v-if="handName" class="play-hand-name">{{ handName }}</span>
    </div>

    <div class="play-cards">
      <!-- 空态提示 -->
      <div v-if="playedCards.length === 0" class="empty-hint">
        选择手牌组成牌型（1-5 张）
      </div>
      <!-- 出牌展示 -->
      <div v-else class="cards-row">
        <div
          v-for="card in playedCards"
          :key="card.id"
          class="playing-card played"
        >
          <!-- 左上角点数+花色 -->
          <div class="card-corner top-left" :style="{ color: suitColor(card.suit) }">
            <div class="card-rank">{{ card.rank }}</div>
            <div class="card-suit-small">{{ card.suit }}</div>
          </div>
          <!-- 中央花色大字符 -->
          <div class="card-center" :style="{ color: suitColor(card.suit) }">{{ card.suit }}</div>
          <!-- 右下角（旋转 180deg） -->
          <div class="card-corner bottom-right" :style="{ color: suitColor(card.suit) }">
            <div class="card-rank">{{ card.rank }}</div>
            <div class="card-suit-small">{{ card.suit }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  playedCards: Array,
  handName: String,
})

function suitColor(suit) {
  return suit === '♥' || suit === '♦' ? 'var(--red)' : 'var(--card-edge)'
}
</script>

<style scoped>
.play-area {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 12px 16px 8px;
  overflow: hidden;
}

.play-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}
.play-title {
  font: 700 13px/1 var(--sans);
  color: var(--muted);
  letter-spacing: 0.5px;
}
.play-hand-name {
  font: 700 16px/1 var(--sans);
  color: #60a5fa;
}

.play-cards {
  display: flex;
  align-items: flex-start;
  flex: 1;
}

.empty-hint {
  font: 14px/1.4 var(--sans);
  color: rgba(200,210,232,.55);
  align-self: center;
  margin-top: 20px;
}

.cards-row {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

/* 出牌区扑克牌（复用全局 playing-card 样式） */
.played {
  cursor: default;
}
.played:hover {
  transform: none;
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
</style>
