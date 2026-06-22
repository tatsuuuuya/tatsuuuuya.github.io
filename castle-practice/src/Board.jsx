import { useState, useRef } from 'react'
import { Shogi } from 'shogi.js'
import { isCastleComplete } from './castles'
import styles from './Board.module.css'

const KIND_KANJI = {
  FU: '歩', KY: '香', KE: '桂', GI: '銀', KI: '金',
  KA: '角', HI: '飛', OU: '玉',
  TO: 'と', NY: '杏', NK: '圭', NG: '全', UM: '馬', RY: '龍',
}

function initShogi() {
  const s = new Shogi()
  s.initialize()
  s.editMode(true)
  return s
}

export default function Board({ castle }) {
  const shogiRef = useRef(initShogi())
  const shogi = shogiRef.current

  const [selected, setSelected] = useState(null)
  const [legalMoves, setLegalMoves] = useState([])
  const [, setTick] = useState(0)

  function isLegal(x, y) {
    return legalMoves.some(m => m.to.x === x && m.to.y === y)
  }

  function reset() {
    shogiRef.current = initShogi()
    setSelected(null)
    setLegalMoves([])
    setTick(n => n + 1)
  }

  function handleClick(x, y) {
    if (selected && isLegal(x, y)) {
      shogi.move(selected.x, selected.y, x, y)
      setSelected(null)
      setLegalMoves([])
      setTick(n => n + 1)
      return
    }
    const piece = shogi.board[x - 1][y - 1]
    if (piece?.color === 0) {
      setSelected({ x, y })
      setLegalMoves(shogi.getMovesFrom(x, y))
    } else {
      setSelected(null)
      setLegalMoves([])
    }
  }

  const completed = castle ? isCastleComplete(shogi.board, castle) : false
  const unmet = castle
    ? castle.requirements.filter(r => {
        const p = shogi.board[r.x - 1][r.y - 1]
        return !(p?.kind === r.kind && p?.color === r.color)
      })
    : []

  const cells = []
  for (let y = 1; y <= 9; y++) {
    for (let xi = 0; xi < 9; xi++) {
      const x = 9 - xi
      const piece = shogi.board[x - 1][y - 1]
      cells.push({ x, y, piece })
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.status}>
        {completed
          ? <span className={styles.completed}>囲い完成！</span>
          : castle
            ? <span>残り <strong>{unmet.length}</strong> 駒</span>
            : null
        }
      </div>
      <div className={styles.label}>後手</div>
      <div className={styles.grid}>
        {cells.map(({ x, y, piece }) => {
          const isSelected = selected?.x === x && selected?.y === y
          const isTarget = isLegal(x, y)
          const isGoal = !completed && unmet.some(r => r.x === x && r.y === y)
          return (
            <div
              key={`${x}-${y}`}
              className={[
                styles.cell,
                piece?.color === 1 ? styles.gote : '',
                isSelected ? styles.selected : '',
                isTarget ? styles.target : '',
                isGoal ? styles.goal : '',
              ].join(' ')}
              onClick={() => handleClick(x, y)}
            >
              {piece ? KIND_KANJI[piece.kind] : (isTarget ? '●' : '')}
            </div>
          )
        })}
      </div>
      <div className={styles.label}>先手</div>
      <button className={styles.resetBtn} onClick={reset}>リセット</button>
    </div>
  )
}
