import { Shogi } from 'shogi.js'
import { isCastleComplete } from './castles'

const MAX_DEPTH = 20

function createShogi(sfen) {
  const s = new Shogi()
  s.initializeFromSFENString(sfen)
  s.editMode(true)
  return s
}

function getSenteMoves(shogi) {
  const moves = []
  for (let x = 1; x <= 9; x++) {
    for (let y = 1; y <= 9; y++) {
      if (shogi.board[x - 1][y - 1]?.color === 0) {
        for (const m of shogi.getMovesFrom(x, y)) {
          moves.push({ from: { x, y }, to: m.to })
        }
      }
    }
  }
  return moves
}

// Returns shortest path (array of moves) or null if not reachable within MAX_DEPTH
export function findShortestPath(initialSfen, castle) {
  const shogi0 = createShogi(initialSfen)
  if (isCastleComplete(shogi0.board, castle)) return []

  const visited = new Set([initialSfen])
  const queue = [{ sfen: initialSfen, path: [] }]

  while (queue.length > 0) {
    const { sfen, path } = queue.shift()
    if (path.length >= MAX_DEPTH) continue

    const shogi = createShogi(sfen)
    for (const move of getSenteMoves(shogi)) {
      const next = createShogi(sfen)
      next.move(move.from.x, move.from.y, move.to.x, move.to.y)

      const newSfen = next.toSFENString()
      if (visited.has(newSfen)) continue
      visited.add(newSfen)

      const newPath = [...path, move]
      if (isCastleComplete(next.board, castle)) return newPath

      queue.push({ sfen: newSfen, path: newPath })
    }
  }

  return null
}
