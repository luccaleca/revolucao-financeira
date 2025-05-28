"use client";
import styles from '../../styles/home.module.css';

export default function HomePage() {
  return (
    <div className={styles.container}>
      <div className={styles.conteudoPrincipal}>
        <h1>Bem-vindo!</h1>
        <p>Estamos felizes em tê-lo aqui. Confira algumas dicas para começar:</p>
        
        <div className={styles.dicas}>
          <h2>Dicas Rápidas</h2>
          <ul>
            <li>Revise suas despesas semanalmente para manter o controle.</li>
            <li>Defina metas financeiras mensais para melhor planejamento.</li>
            <li>Use nosso calendário para acompanhar suas contas a pagar e receber.</li>
          </ul>
        </div>

        <div className={styles.curiosidades}>
          <h2>Curiosidades Financeiras</h2>
          <p>Você sabia? Pequenas economias diárias podem resultar em grandes poupanças ao longo do tempo!</p>
        </div>

        <div className={styles.feedback}>
          <h2>Feedback</h2>
          <p>Deixe sua opinião sobre o software e ajude-nos a melhorar!</p>
          <button className={styles.botaoFeedback}>Enviar Feedback</button>
        </div>
      </div>
    </div>
  );
}