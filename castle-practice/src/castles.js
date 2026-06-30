// color: 0 = 先手 (sente), 1 = 後手 (gote)
// Coordinates: x=1..9 (筋, 9=left), y=1..9 (段, 9=先手back rank)

export const CASTLES = [
  {
    id: 'mino',
    name: '美濃囲い',
    description: '振り飛車の代表的な囲い。玉を左端に素早く移動させ、金銀でコンパクトに守る。横からの攻めに強く、手数が少ないのが特徴。HBNくんが絶対につかわない囲いの1つ。',
    requirements: [
      { x: 2, y: 8, kind: 'OU', color: 0 }, // 玉 2八
      { x: 3, y: 8, kind: 'GI', color: 0 }, // 銀 3八
      { x: 5, y: 8, kind: 'KI', color: 0 }, // 金 5八
      { x: 4, y: 9, kind: 'KI', color: 0 }, // 金 4九
    ],
  },
  {
    id: 'yagura',
    name: '矢倉',
    description: '居飛車の代表的な囲い。金銀が密集して縦の攻めに非常に強固。組み上げるのに手数がかかるが、完成すれば堅さは抜群。HBNくんが絶対につかわない囲いの1つ。',
    requirements: [
      { x: 8, y: 8, kind: 'OU', color: 0 }, // 玉 8八
      { x: 7, y: 8, kind: 'KI', color: 0 }, // 金 7八
      { x: 6, y: 8, kind: 'KA', color: 0 }, // 角 6八
      { x: 6, y: 7, kind: 'KI', color: 0 }, // 金 6七
      { x: 7, y: 7, kind: 'GI', color: 0 }, // 銀 7七
      { x: 7, y: 6, kind: 'FU', color: 0 }, // 歩 7六
      { x: 6, y: 6, kind: 'FU', color: 0 }, // 歩 6六
      { x: 5, y: 6, kind: 'FU', color: 0 }, // 歩 5六
    ],
  },
  {
    id: 'anaguma_right',
    name: '右穴熊',
    description: '玉を右端（1九）に潜り込ませ、金銀で固める最強クラスの堅陣。組み上げれば攻め合いで有利になりやすいが、端攻めには注意が必要。HBNくんが絶対につかわない囲いの1つ。',
    requirements: [
      { x: 1, y: 9, kind: 'OU', color: 0 }, // 玉 1九
      { x: 1, y: 8, kind: 'KY', color: 0 }, // 香 1八
      { x: 2, y: 8, kind: 'GI', color: 0 }, // 銀 2八
      { x: 3, y: 8, kind: 'KI', color: 0 }, // 金 3八
      { x: 3, y: 9, kind: 'KI', color: 0 }, // 金 3九
    ],
  },
]

export function isCastleComplete(board, castle) {
  return castle.requirements.every(({ x, y, kind, color }) => {
    const piece = board[x - 1][y - 1]
    return piece?.kind === kind && piece?.color === color
  })
}
