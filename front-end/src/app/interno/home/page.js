"use client";
import styles from '../../styles/home.module.css';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.cardsLinha}>
        {/* Card de Dicas */}
        <div className={styles.cardDestaque}>
          <h2>💡 Dicas Rápidas</h2>
          <ul>
            <li>Revise suas despesas semanalmente para manter o controle.</li>
            <li>Defina metas financeiras mensais para melhor planejamento.</li>
            <li>Use nosso calendário para acompanhar suas contas a pagar e receber.</li>
          </ul>
        </div>
        {/* Card de Curiosidades */}
        {/* Card Guia Rápido */}
        <div className={styles.cardGuia}>
          <h2>📘 Guia Rápido</h2>
          <p>Veja como utilizar o software:</p>
          <ul>
            <li>Cadastre suas receitas e despesas facilmente.</li>
            <li>Acompanhe o saldo em tempo real.</li>
            <li>Visualize relatórios e gráficos para melhor análise.</li>
            <li>Programe lembretes de contas a pagar e receber.</li>
          </ul>
          <button
            className={styles.atalho}
            onClick={() => router.push('/guiaCompleto')}
          >
            Acessar Guia Completo
          </button>
        </div>
        {/* Card Entrar em Contato */}
        <div className={styles.cardContato}>
          <h2>📨 Entrar em Contato</h2>
          <p>Ficou com dúvidas ou precisa de ajuda? Fale conosco!</p>
          <button className={styles.atalho} onClick={() => router.push('/contato')}>Entrar em Contato</button>
        </div>
      </div>
    </div>
  );
}