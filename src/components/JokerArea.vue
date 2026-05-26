<template>
  <!-- 第 1 段：Joker 区，贴段顶 -->
  <section class="joker-area">
    <div class="joker-header">
      <span class="joker-title">JOKERS · {{ ownedJokers.length }}/5</span>
    </div>
    <div class="joker-slots">
      <!-- 已有的 Joker 卡 -->
      <div
        v-for="joker in ownedJokers"
        :key="joker.id"
        class="joker-card"
        :class="{ triggering: triggeringIds.includes(joker.id) }"
        :style="{ '--rarity': rarityColor(joker.rarity), boxShadow: `inset 0 0 0 2px ${rarityColor(joker.rarity)}, 0 4px 0 rgba(0,0,0,.55)` }"
      >
        <!-- 名称顶部黑底条 -->
        <div class="joker-name-bar">{{ joker.name }}</div>
        <!-- 大 art -->
        <div class="joker-art-area">
          <span class="joker-art">{{ joker.art }}</span>
        </div>
        <!-- 描述底部 -->
        <div class="joker-desc-bar">{{ joker.description }}</div>
      </div>

      <!-- 空槽补满 5 格 -->
      <div
        v-for="i in emptySlots"
        :key="'empty-' + i"
        class="joker-empty"
      >
        <span class="plus">+</span>
        <span class="label">空槽</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { RARITY_VAR } from '../config/jokers.js'
import { MAX_JOKERS } from '../config/constants.js'

const props = defineProps({
  ownedJokers: Array,
  triggeringIds: Array,
})

const emptySlots = computed(() => MAX_JOKERS - props.ownedJokers.length)

function rarityColor(rarity) {
  return RARITY_VAR[rarity] || RARITY_VAR.common
}
</script>

<style scoped>
.joker-area {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 12px 16px 8px;
  overflow: hidden;
}

.joker-header {
  margin-bottom: 10px;
}
.joker-title {
  font: 14px/1 'Press Start 2P', monospace;
  color: var(--gold);
  text-shadow: 2px 2px 0 #000;
  letter-spacing: 1px;
}

.joker-slots {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  flex-wrap: nowrap;
  overflow-x: auto;
}

/* joker-card 基础样式来自全局 style.css */
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
