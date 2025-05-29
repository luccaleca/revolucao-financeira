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
  // Adicione outras rotas e títulos conforme necessário
};

export default function InternoLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // Busca o título correspondente à rota, ou um padrão
  const titulo = TITULOS[pathname] || 'Página';

  return (
    <div className={`${styles.container} ${collapsed ? styles.sidebarCollapsed : ''}`}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={styles.mainContent}>
        <div style={{ marginTop: 0, marginBottom: '24px' }}>
          <Topbar titulo={titulo} />
        </div>
        {children}
      </div>
    </div>
  );
}