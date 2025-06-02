'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import styles from '../styles/home.module.css';

// Mapeie as rotas para os títulos desejados
const TITULOS = {
  '/interno/home': 'Home',
  '/interno/dashboard': 'Dashboard',
  '/interno/contasPagarReceber': 'Contas a Pagar e Receber',
  '/interno/relatorios': 'Relatórios',
  '/interno/configuracao': 'Configuração',
  '/interno/receitasDespesas': 'Receitas e Despesas',
  '/interno/analiseLiquidez': 'Análise de Liquidez',
  '/interno/planejamentoOrcamentario': 'Planejamento Orçamentário',
};

export default function InternoLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const titulo = TITULOS[pathname] || 'Página';

  return (
    <div className={`${styles.container} ${collapsed ? styles.sidebarCollapsed : ''}`}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Topbar titulo={titulo} />
      <div className={styles.mainContent}>
        {children}
      </div>
    </div>
  );
}