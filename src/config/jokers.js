// 6 张 Joker 候选库 - 字段硬锁定
// effect 签名: (cards, chips, mult, handTypeName) => ({ chips, mult })
// cards: 出牌数组，每张 { suit, rank }

export const JOKERS = [
  {
    id: 'joker',
    name: '小丑',
    rarity: 'common',
    price: 3,
    art: '🃏',
    description: '每手 +4 倍率',
    // 无条件 +4 mult
    effect: (cards, chips, mult, handTypeName) => ({ chips, mult: mult + 4 }),
  },
  {
    id: 'scholar',
    name: '学者',
    rarity: 'common',
    price: 3,
    art: '📖',
    description: '每张 A：+4 倍率',
    // 出牌中每张 A 加 4 mult
    effect: (cards, chips, mult, handTypeName) => {
      const aces = cards.filter(c => c.rank === 'A').length
      return { chips, mult: mult + aces * 4 }
    },
  },
  {
    id: 'heart_lover',
    name: '红心收藏家',
    rarity: 'rare',
    price: 5,
    art: '❤️',
    description: '含 ♥ 时倍率 ×4',
    // 出牌中含红心 → mult × 4
    effect: (cards, chips, mult, handTypeName) => {
      const hasHeart = cards.some(c => c.suit === '♥')
      return { chips, mult: hasHeart ? mult * 4 : mult }
    },
  },
  {
    id: 'club_lover',
    name: '梅花爱好者',
    rarity: 'rare',
    price: 5,
    art: '♣',
    description: '含 ♣ 时倍率 ×4',
    // 出牌中含梅花 → mult × 4
    effect: (cards, chips, mult, handTypeName) => {
      const hasClub = cards.some(c => c.suit === '♣')
      return { chips, mult: hasClub ? mult * 4 : mult }
    },
  },
  {
    id: 'royal_head',
    name: '皇家头牌',
    rarity: 'rare',
    price: 5,
    art: '👑',
    description: '含 J/Q/K 时倍率 ×10',
    // 出牌中含 J/Q/K → mult × 10
    effect: (cards, chips, mult, handTypeName) => {
      const hasRoyal = cards.some(c => ['J', 'Q', 'K'].includes(c.rank))
      return { chips, mult: hasRoyal ? mult * 10 : mult }
    },
  },
  {
    id: 'straight_flush_master',
    name: '同花顺大师',
    rarity: 'legendary',
    price: 8,
    art: '🔥',
    description: '同花顺时 +50 倍率',
    // 同花顺才触发 → +50 mult
    effect: (cards, chips, mult, handTypeName) => {
      return { chips, mult: handTypeName === '同花顺' ? mult + 50 : mult }
    },
  },
]

// 按 id 快速查找
export const JOKER_MAP = Object.fromEntries(JOKERS.map(j => [j.id, j]))

// 稀有度颜色 CSS 变量名映射
export const RARITY_VAR = {
  common:    'var(--rarity-common)',
  uncommon:  'var(--rarity-uncommon)',
  rare:      'var(--rarity-rare)',
  legendary: 'var(--rarity-legendary)',
}
