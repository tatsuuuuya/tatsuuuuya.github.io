// color: 0 = 先手 (sente), 1 = 後手 (gote)
// Coordinates: x=1..9 (筋, 9=left), y=1..9 (段, 9=先手back rank)

export const CASTLES = [
  {
    id: 'mino',
    name: '美濃囲い',
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
