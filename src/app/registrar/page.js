"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/registrar.module.css';

export default function RegisterPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.backButton}
        onClick={() => router.push('/')}
      >
        ← Voltar para o início
      </button>
      <form className={styles.form}>
        <h2>Cadastro de Usuário</h2>
        <div>
          <label>Nome Completo</label>
          <input type="text" required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" required />
        </div>
        <div>
          <label>Senha</label>
          <input type="password" required />
        </div>
        <div>
          <label>Confirmação de Senha</label>
          <input type="password" required />
        </div>
        <div className={styles.checkboxContainer}>
          <label>
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={() => setIsAdmin(!isAdmin)}
            />
            Usuário Administrador
            <span className={styles.tooltip}>
              ?
              <span className={styles.tooltipText}>
                Um administrador pode gerenciar usuários e configurações da empresa.
              </span>
            </span>
          </label>
        </div>
        <button type="submit" className={styles.submitButton}>Registrar</button>
      </form>
    </div>
  );
}