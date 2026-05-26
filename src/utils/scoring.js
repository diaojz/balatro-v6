// 计分逻辑
// 公式：(handType.chips + 所有出牌点数和) × handType.mult，再按 ownedJokers 顺序依次应用 effect
// 点数：A=11 / J/Q/K=10 / 其余=数字本身

import { identifyHand } from './poker.js'

const CARD_VALUES = {
  'A': 11, 'K': 10, 'Q': 10, 'J': 10,
  '2': 2, '3': 3, '4': 4, '5': 5,
  '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
}

export function getCardValue(rank) {
  return CARD_VALUES[rank] ?? parseInt(rank, 10) ?? 0
}

/**
 * 计算出牌得分
 * @param {Array} cards       - 出牌数组，每张 { suit, rank }
 * @param {Array} ownedJokers - 玩家持有的 Joker 对象数组（含 effect 函数），按槽位顺序
 * @returns {{ score: number, chips: number, mult: number, handName: string, triggeredJokerIds: string[] }}
 */
export function calculateScore(cards, ownedJokers = []) {
  const handType = identifyHand(cards)

  // 出牌点数总和
  const cardSum = cards.reduce((sum, c) => sum + getCardValue(c.rank), 0)

  let chips = handType.chips + cardSum
  let mult = handType.mult

  // 按顺序应用每张 Joker 的 effect
  const triggeredJokerIds = []
  for (const joker of ownedJokers) {
    if (typeof joker.effect === 'function') {
      const before = { chips, mult }
      const result = joker.effect(cards, chips, mult, handType.name)
      chips = result.chips
      mult = result.mult
      // 判断是否真的触发了（值变了就算触发）
      if (result.chips !== before.chips || result.mult !== before.mult) {
        triggeredJokerIds.push(joker.id)
      }
    }
  }

  const score = chips * mult

  return {
    score,
    chips,
    mult,
    handName: handType.name,
    triggeredJokerIds,
  }
}
