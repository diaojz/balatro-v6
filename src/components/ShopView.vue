<template>
  <!-- 商店覆盖层：全屏遮罩 -->
  <div class="shop-overlay">
    <div class="shop-card">
      <!-- 标题 -->
      <h2 class="shop-title">商店</h2>
      <p class="shop-subtitle">
        通关奖励到账！金币 ${{ coins }} · Joker 槽 {{ ownedJokers.length }}/5
      </p>

      <!-- 商店 Joker 列表 -->
      <div class="shop-jokers">
        <div
          v-for="joker in shopJokers"
          :key="joker.id"
          class="shop-joker-item"
        >
          <!-- Joker 卡 -->
          <div
            class="joker-card shop-joker-card"
            :style="{ boxShadow: `inset 0 0 0 2px ${rarityColor(joker.rarity)}, 0 4px 0 rgba(0,0,0,.55)` }"
          >
            <div class="joker-name-bar">{{ joker.name }}</div>
            <div class="joker-art-area">
              <span class="joker-art">{{ joker.art }}</span>
            </div>
            <div class="joker-desc-bar">{{ joker.description }}</div>
          </div>

          <!-- 购买按钮 -->
          <button
            class="px-btn shop-buy-btn"
            :class="buyBtnClass(joker)"
            :disabled="joker.sold || coins < joker.price || ownedJokers.length >= 5"
            @click="$emit('buy', joker.id)"
          >
            {{ buyBtnText(joker) }}
          </button>
        </div>
      </div>

      <!-- 跳过 -->
      <button class="px-btn px-btn-skip skip-btn" @click="$emit('skip')">
        跳过 →
      </button>
    </div>
  </div>
</template>

<script setup>
import { RARITY_VAR } from '../config/jokers.js'

const props = defineProps({
  shopJokers: Array,
  coins: Number,
  ownedJokers: Array,
  blindIndex: Number,
})

defineEmits(['buy', 'skip'])

function rarityColor(rarity) {
  return RARITY_VAR[rarity] || RARITY_VAR.common
}

function buyBtnText(joker) {
  if (joker.sold) return '已售出'
  if (props.ownedJokers.length >= 5) return '槽满了'
  if (props.coins < joker.price) return '钱不够'
  return `购买 $${joker.price}`
}

function buyBtnClass(joker) {
  if (joker.sold || props.ownedJokers.length >= 5 || props.coins < joker.price) {
    return 'px-btn-discard'
  }
  return 'px-btn-play'
}
</script>

<style scoped>
.shop-overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 8, 24, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(4px);
}

.shop-card {
  background: linear-gradient(180deg, #1a2858 0%, #0d1a40 100%);
  border: 2px solid var(--sb-blue);
  border-radius: 16px;
  padding: 36px 40px;
  min-width: 520px;
  max-width: 90vw;
  text-align: center;
}

.shop-title {
  font: 800 32px/1 var(--sans);
  color: var(--gold);
  margin-bottom: 8px;
  text-shadow: 2px 2px 0 rgba(0,0,0,.5);
}
.shop-subtitle {
  font: 600 14px/1.4 var(--sans);
  color: var(--text-dim);
  margin-bottom: 28px;
}

.shop-jokers {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 28px;
}

.shop-joker-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.shop-joker-card {
  width: 140px;
  height: 200px;
}

.shop-buy-btn {
  width: 140px;
  min-height: 44px;
  padding: 10px 16px;
  font-size: 13px;
}

.skip-btn {
  padding: 14px 40px;
}

/* 复用 JokerArea 内部布局样式（这里直接写不作用域隔离） */
.joker-name-bar {
  position: absolute;
  top: 6px;
  left: 6px;
  right: 6px;
  height: 18px;
  background: linear-gradient(180deg, #2a1a3f, #160a23);
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font: 6px/1 'Press Start 2P', monospace;
  color: var(--gold);
  text-shadow: 1px 1px 0 #000;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 0 4px;
}
.joker-art-area {
  position: absolute;
  top: 28px;
  left: 0;
  right: 0;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(ellipse at center, var(--paper-1), var(--paper-3));
}
.joker-art {
  font-size: 36px;
}
.joker-desc-bar {
  position: absolute;
  bottom: 6px;
  left: 6px;
  right: 6px;
  height: 76px;
  background: linear-gradient(180deg, var(--paper-1), var(--paper-2));
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font: 700 9px/1.3 'VT323', monospace;
  color: #4a2d0a;
  text-align: center;
  padding: 4px;
  overflow: hidden;
}
</style>
