"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../styles/sidebar.module.css'; 

export default function Sidebar({ collapsed, setCollapsed }) {
  const router = useRouter();

  function handleSair(e) {
    e.preventDefault();
    if (window.confirm("Você quer mesmo sair?")) {
      router.push('/'); // Vai para a página inicial (login)
    }
  }

  return (
    <nav className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.logoContainer}>
        <div className={styles.logoCard}>
          <img
            src="/images/logo.png"
            alt="Logo"
            className={styles.logo}
          />
        </div>
      </div>
      <button
        className={styles.collapseBtn}
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? "Expandir sidebar" : "Contrair sidebar"}
      >
        {collapsed ? '⮞' : '⮜'}
      </button>
      <ul className={styles.menu}>
        <li className={styles.menuItem}>
          <Link href="/interno/home">Home</Link>
        </li>
        <li className={styles.menuItem}>
          <Link href="/interno/dashboard">Dashboard</Link>
        </li>
        <li className={styles.menuItem}>
          <Link href="/interno/contasPagarReceber">Pagar/Receber</Link>
        </li>
        <li className={styles.menuItem}>
          <Link href="/interno/analiseLiquidez">Análise de Liquidez</Link>
        </li>
        <li className={styles.menuItem}>
          <Link href="/interno/planejamentoOrcamentario">Planejamento Orçamentário</Link>
        </li>
        <li className={styles.menuItem}>
          <Link href="/interno/dre">DRE</Link>
        </li>
        <li className={styles.menuItem}>
          <Link href="/interno/configuracao">Configuração</Link>
        </li>
        <li className={styles.menuItem}>
          <Link href="/" onClick={handleSair}>Sair</Link>
        </li>
      </ul>
    </nav>
  );
}