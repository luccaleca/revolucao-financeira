"use client";
import styles from '../../styles/dashboard.module.css';

export default function DashboardPage() {
  return (
    <div className={styles.container}>
  
      {/* Conteúdo Principal */}
      <main className={styles.mainContent}>
        <div className={styles.grid}>
          <div className={styles.card}>Total Receita</div>
          <div className={styles.card}>Total Despesas</div>
          <div className={styles.card}>Lucro Líquido</div>
          <div className={styles.card}>Saldo Final do Mês</div>
          <div className={styles.card}>Contas a Receber</div>
          <div className={styles.card}>Índice de Liquidez Reduzida</div>
          <div className={styles.card}>Contas a Pagar</div>
          <div className={styles.card}>Índice de Liquidez</div>
          <div className={styles.card}>Receitas e Despesas</div>
        </div>
      </main>
    </div>
  );
}