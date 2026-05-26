<template>
  <!-- 通关/失败覆盖层 -->
  <div class="end-overlay">
    <div class="end-card">
      <div class="end-icon">{{ state === 'won' ? '🎉' : '💀' }}</div>
      <h2 class="end-title">{{ state === 'won' ? '通关全部' : '失败' }}</h2>
      <p v-if="state === 'lost'" class="end-desc">
        卡在第 {{ blindIndex + 1 }} 关
      </p>
      <p v-else class="end-desc won-desc">
        恭喜通过全部 3 关！
      </p>
      <button class="px-btn px-btn-restart" @click="$emit('restart')">
        重新开始
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  state: String,   // 'won' | 'lost'
  blindIndex: Number,
})

defineEmits(['restart'])
</script>

<style scoped>
.end-overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 8, 24, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  backdrop-filter: blur(6px);
}

.end-card {
  background: linear-gradient(180deg, #1a2858 0%, #0d1a40 100%);
  border: 2px solid var(--sb-blue);
  border-radius: 16px;
  padding: 48px 60px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.end-icon {
  font-size: 72px;
  line-height: 1;
}

.end-title {
  font: 900 32px/1 var(--sans);
  color: var(--text);
  margin: 0;
}

.end-desc {
  font: 600 16px/1.4 var(--sans);
  color: var(--text-dim);
  margin: 0;
}

.won-desc {
  color: var(--green);
}
</style>
