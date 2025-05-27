"use client";
import styles from '../styles/home.module.css';

export default function HomePage() {
  return (
    <div className={styles.container}>

      <main className={styles.mainContent}>
        <h1>Bem-vindo à Página Inicial</h1>
        <p>Selecione uma opção no menu para começar.</p>
      </main>
    </div>
  );
}