"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../styles/sidebar.module.css'; 

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  function handleSair(e) {
    e.preventDefault();
    if (window.confirm("Você quer mesmo sair?")) {
      router.push('/login');
    }
  }

  return (
    <nav className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <button
        className={styles.collapseBtn}
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? "Expandir sidebar" : "Contrair sidebar"}
      >
        {collapsed ? '⮞' : '⮜'}
      </button>
      <ul className={styles.menu}>
        <li className={styles.menuItem}>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li className={styles.menuItem}>
          <Link href="/receitas">Receitas</Link>
        </li>
        <li className={styles.menuItem}>
          <Link href="/despesas">Despesas</Link>
        </li>
        <li className={styles.menuItem}>
          <Link href="/profile">Contas a Pagar/Receber</Link>
        </li>
        <li className={styles.menuItem}>
          <Link href="/relatorios">Relatórios</Link>
        </li>
        <li className={styles.menuItem}>
          <Link href="/configuracao">Configuração</Link>
        </li>
        <li className={styles.menuItem}>
          {/* Botão de sair com confirmação */}
          <a href="/login" onClick={handleSair}>Sair</a>
        </li>
      </ul>
    </nav>
  );
}