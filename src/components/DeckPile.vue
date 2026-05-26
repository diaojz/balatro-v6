<template>
  <!-- fixed 右下牌堆 -->
  <div class="deck-pile" ref="pileRef">
    <div class="deck-layer"></div>
    <div class="deck-layer"></div>
    <div class="deck-layer"></div>
    <div class="deck-count">{{ deckCount }}/52</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  deckCount: Number,
})

const pileRef = ref(null)

// 暴露 DOM ref 给父组件用于发牌动画的 getBoundingClientRect()
defineExpose({ pileRef })
</script>

<style scoped>
/* 样式来自全局 style.css .deck-pile / .deck-layer / .deck-count */
</style>
