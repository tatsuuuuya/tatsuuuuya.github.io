import { useState } from 'react'
import Board from './Board'
import { CASTLES } from './castles'
import styles from './App.module.css'

export default function App() {
  const [castleId, setCastleId] = useState(CASTLES[0].id)
  const selectedCastle = CASTLES.find(c => c.id === castleId)

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>囲い練習</h1>
      <select
        className={styles.select}
        value={castleId}
        onChange={e => setCastleId(e.target.value)}
      >
        {CASTLES.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      <Board castle={selectedCastle} />
    </div>
  )
}
