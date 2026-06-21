import Board from './Board'
import styles from './App.module.css'

export default function App() {
  return (
    <div className={styles.app}>
      <h1 className={styles.title}>囲い練習</h1>
      <p className={styles.subtitle}>囲いを最短手順で完成させよう</p>
      <Board />
    </div>
  )
}
