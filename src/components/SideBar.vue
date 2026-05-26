<template>
  <aside class="sidebar">
    <!-- 1. Logo -->
    <div class="logo-block">
      <span class="logo-text">🃏 小丑牌</span>
    </div>

    <!-- 2. 盲注大面板 -->
    <div class="sb-panel blind-panel">
      <div class="hud-label">盲注 {{ blindIndex + 1 }}/3</div>
      <div class="blind-main">
        <span class="blind-icon">{{ blind.icon }}</span>
        <span class="blind-name">{{ blind.name }}</span>
      </div>
      <div class="hud-label" style="margin-top:8px">目标分</div>
      <div class="inset-num">
        <span class="target-score">{{ blind.target }}</span>
      </div>
      <div class="reward-text">奖励 ${{ rewardPreview }}</div>
    </div>

    <!-- 3. Round Score + 进度条 -->
    <div class="sb-panel">
      <div class="hud-label">当前分</div>
      <div class="inset-num" style="width:100%;text-align:center">
        <span class="round-score">{{ blindScore }}</span>
      </div>
      <!-- 进度条 -->
      <div class="progress-bar-bg">
        <div class="progress-bar-fill" :style="{ width: progressPercent + '%' }"></div>
      </div>
    </div>

    <!-- 4. HAND 计分块 -->
    <div class="sb-panel">
      <div class="hand-type-name">{{ handName || '— 选牌出牌 —' }}</div>
      <div class="score-row">
        <div class="chips-block">
          <div class="score-num">{{ handChips }}</div>
          <div class="score-label">CHIPS</div>
        </div>
        <span class="times-sign">×</span>
        <div class="mult-block">
          <div class="score-num">{{ handMult }}</div>
          <div class="score-label">MULT</div>
        </div>
      </div>
    </div>

    <!-- 5. Hands / Discards -->
    <div class="sb-panel hand-discard-row">
      <div class="hd-panel hd-hands">
        <div class="hud-label">剩余手数</div>
        <div class="inset-num">
          <span class="hd-num green">{{ handsLeft }}</span>
        </div>
      </div>
      <div class="hd-panel hd-discards">
        <div class="hud-label">剩余弃牌</div>
        <div class="inset-num">
          <span class="hd-num red">{{ discardsLeft }}</span>
        </div>
      </div>
    </div>

    <!-- 6. 金币 -->
    <div class="sb-panel coins-panel">
      <div class="hud-label">金币</div>
      <div class="coins-display">
        <span class="coins-dollar">$</span>
        <span class="coins-num">{{ coins }}</span>
      </div>
    </div>

    <!-- 7. Ante 1/3 · Round X -->
    <div class="sb-panel ante-round">
      <span class="ante-text">Ante 1/3</span>
      <span class="sep">·</span>
      <span class="round-text">Round {{ round }}</span>
    </div>

    <!-- 8. 重新开始按钮 -->
    <button class="px-btn px-btn-restart restart-btn" @click="$emit('restart')">
      重新开始
    </button>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { STARTING_HANDS } from '../config/constants.js'

const props = defineProps({
  blindIndex: Number,
  blind: Object,
  blindScore: Number,
  handsLeft: Number,
  discardsLeft: Number,
  coins: Number,
  round: Number,
  handName: String,
  handChips: Number,
  handMult: Number,
})

defineEmits(['restart'])

// 进度条：最大 100%
const progressPercent = computed(() => {
  if (!props.blind?.target) return 0
  return Math.min(100, (props.blindScore / props.blind.target) * 100)
})

// 奖励预览（显示最大奖励 = 5 + STARTING_HANDS）
const rewardPreview = computed(() => 5 + props.handsLeft)
</script>

<style scoped>
.logo-block {
  padding: 8px 4px;
  text-align: center;
}
.logo-text {
  font: 18px/1 'Press Start 2P', monospace;
  color: #ffd166;
  text-shadow: 2px 2px 0 #000;
  letter-spacing: 2px;
}

.blind-panel .blind-main {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 6px 0 4px;
}
.blind-icon {
  font-size: 20px;
}
.blind-name {
  font: 700 18px/1 var(--sans);
  color: var(--text);
}
.target-score {
  font: 700 28px/1 'VT323', monospace;
  color: var(--red);
}
.reward-text {
  font: 700 13px/1 var(--sans);
  color: var(--gold);
  margin-top: 6px;
}

.round-score {
  font: 700 40px/1 'VT323', monospace;
  color: var(--red);
}

.progress-bar-bg {
  width: 100%;
  height: 8px;
  background: rgba(255,255,255,.1);
  border-radius: 4px;
  margin-top: 8px;
  overflow: hidden;
}
.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--chips-from), var(--red));
  border-radius: 4px;
  transition: width .3s ease;
}

.hand-type-name {
  font: 700 14px/1 var(--sans);
  color: #60a5fa;
  margin-bottom: 8px;
  min-height: 14px;
}
.score-row {
  display: flex;
  align-items: center;
  gap: 0;
}

.hand-discard-row {
  display: flex;
  gap: 8px;
  padding: 10px 12px;
}
.hd-panel {
  flex: 1;
  text-align: center;
}
.hd-num {
  font: 700 34px/1 'VT323', monospace;
}
.hd-num.green { color: var(--green); }
.hd-num.red   { color: var(--red); }

.coins-panel {
  text-align: center;
}
.coins-display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
  background: #050818;
  border-radius: 8px;
  padding: 8px 12px;
  border: 1px solid rgba(74,107,255,.3);
}
.coins-dollar {
  font: 700 14px/1 'Press Start 2P', monospace;
  color: var(--money);
}
.coins-num {
  font: 700 44px/1 'VT323', monospace;
  color: var(--money);
}

.ante-round {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}
.ante-text {
  font: 600 13px/1 var(--sans);
  color: var(--gold);
}
.sep {
  color: var(--muted);
}
.round-text {
  font: 600 13px/1 var(--sans);
  color: #60a5fa;
}

.restart-btn {
  width: 100%;
  margin-top: auto;
}
</style>
