// 牌型识别
// 出牌 1-5 张均可，少于 5 张只能匹配不依赖 5 张的牌型

// 点数顺序（用于顺子判断）
const RANK_ORDER = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']

function getRankIndex(rank) {
  return RANK_ORDER.indexOf(rank)
}

// 检查是否是顺子（含 A-2-3-4-5 和 10-J-Q-K-A）
function isStraight(cards) {
  if (cards.length !== 5) return false
  const indices = cards.map(c => getRankIndex(c.rank)).sort((a, b) => a - b)

  // 普通顺子
  const isNormal = indices.every((v, i) => i === 0 || v === indices[i-1] + 1)
  if (isNormal) return true

  // A-2-3-4-5（low straight）：indices 应为 [0,1,2,3,12]
  const isLow = JSON.stringify(indices) === JSON.stringify([0,1,2,3,12])
  return isLow
}

// 检查是否同花
function isFlush(cards) {
  if (cards.length !== 5) return false
  return cards.every(c => c.suit === cards[0].suit)
}

// 获取点数分组
function getRankGroups(cards) {
  const groups = {}
  for (const card of cards) {
    groups[card.rank] = (groups[card.rank] || 0) + 1
  }
  return Object.values(groups).sort((a, b) => b - a) // 降序
}

/**
 * 识别牌型
 * @param {Array} cards - 出牌数组，每张 { suit, rank }
 * @returns {{ name: string, chips: number, mult: number }}
 */
export function identifyHand(cards) {
  if (!cards || cards.length === 0) {
    return { name: '高牌', chips: 5, mult: 1 }
  }

  const groups = getRankGroups(cards)
  const flush = isFlush(cards)
  const straight = isStraight(cards)

  // 同花顺（5 张）
  if (flush && straight) {
    return { name: '同花顺', chips: 100, mult: 8 }
  }
  // 四条（需要 4 张同点）
  if (groups[0] === 4) {
    return { name: '四条', chips: 60, mult: 7 }
  }
  // 葫芦（3+2）
  if (groups[0] === 3 && groups[1] === 2) {
    return { name: '葫芦', chips: 40, mult: 4 }
  }
  // 同花（5 张同花色）
  if (flush) {
    return { name: '同花', chips: 35, mult: 4 }
  }
  // 顺子（5 张连续）
  if (straight) {
    return { name: '顺子', chips: 30, mult: 4 }
  }
  // 三条
  if (groups[0] === 3) {
    return { name: '三条', chips: 30, mult: 3 }
  }
  // 两对
  if (groups[0] === 2 && groups[1] === 2) {
    return { name: '两对', chips: 20, mult: 2 }
  }
  // 对子
  if (groups[0] === 2) {
    return { name: '对子', chips: 10, mult: 2 }
  }
  // 高牌
  return { name: '高牌', chips: 5, mult: 1 }
}
