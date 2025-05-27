'use client';
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import styles from '../styles/home.module.css';

export default function InternoLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`${styles.container} ${collapsed ? styles.sidebarCollapsed : ''}`}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}