import { useState } from 'react'
import Board from './Board'
import { CASTLES } from './castles'
import styles from './App.module.css'

const KIND_KANJI = {
  FU: '歩', KY: '香', KE: '桂', GI: '銀', KI: '金',
  KA: '角', HI: '飛', OU: '玉',
}

const PREVIEW_ROWS = [5, 6, 7, 8, 9]
const PREVIEW_COLS = [9, 8, 7, 6, 5, 4, 3, 2, 1]

function CastlePreview({ castle }) {
  const pieceMap = {}
  castle.requirements.forEach(r => { pieceMap[`${r.x}-${r.y}`] = r })

  return (
    <div className={styles.previewWrap}>
      <div className={styles.previewRowLabels}>
        {PREVIEW_ROWS.map(y => (
          <div key={y} className={styles.previewRowLabel}>
            {'五六七八九'[y - 5]}
          </div>
        ))}
      </div>
      <div className={styles.previewGrid}>
        {PREVIEW_ROWS.map(y =>
          PREVIEW_COLS.map(x => {
            const req = pieceMap[`${x}-${y}`]
            return (
              <div
                key={`${x}-${y}`}
                className={[
                  styles.previewCell,
                  req ? styles.previewPiece : '',
                ].join(' ')}
              >
                {req ? KIND_KANJI[req.kind] : ''}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default function App() {
  const [castleId, setCastleId] = useState(CASTLES[0].id)
  const [showInfo, setShowInfo] = useState(false)
  const selectedCastle = CASTLES.find(c => c.id === castleId)

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>囲い練習</h1>
      <div className={styles.controls}>
        <select
          className={styles.select}
          value={castleId}
          onChange={e => setCastleId(e.target.value)}
        >
          {CASTLES.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button className={styles.infoBtn} onClick={() => setShowInfo(true)}>？</button>
      </div>
      <Board castle={selectedCastle} />

      {showInfo && (
        <div className={styles.overlay} onClick={() => setShowInfo(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span className={styles.modalTitle}>{selectedCastle.name}</span>
              <button className={styles.closeBtn} onClick={() => setShowInfo(false)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <CastlePreview castle={selectedCastle} />
              <p className={styles.modalDesc}>{selectedCastle.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
