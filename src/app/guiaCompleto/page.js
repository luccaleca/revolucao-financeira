"use client";
import styles from '../styles/guiaCompleto.module.css';
import { useRouter } from 'next/navigation';

export default function GuiaCompleto() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.guiaBox}>
        <button
          className={styles.botaoVoltar}
          onClick={() => router.back()}
        >
          ← Voltar
        </button>
        <h1 className={styles.titulo}>📘 Guia Completo do Sistema</h1>
        <h2 className={styles.subtitulo}>1. Cadastro de Receitas e Despesas</h2>
        <p>Registre todas as suas entradas e saídas financeiras de forma simples e rápida. Use o menu lateral para acessar a área de lançamentos.</p>
        <ul>
          <li>Clique em "Adicionar Receita" ou "Adicionar Despesa".</li>
          <li>Preencha os campos obrigatórios e salve.</li>
        </ul>

        <h2 className={styles.subtitulo}>2. Acompanhamento do Saldo</h2>
        <p>Visualize seu saldo atualizado em tempo real na tela inicial do sistema.</p>

        <h2 className={styles.subtitulo}>3. Relatórios e Gráficos</h2>
        <p>Acesse relatórios detalhados e gráficos interativos para analisar seus gastos e receitas por categoria, período e muito mais.</p>

        <h2 className={styles.subtitulo}>4. Metas Financeiras</h2>
        <p>Defina metas de economia ou investimento e acompanhe seu progresso mês a mês.</p>

        <h2 className={styles.subtitulo}>5. Lembretes de Contas</h2>
        <p>Programe lembretes para não esquecer de pagar contas importantes. O sistema envia notificações automáticas para você.</p>

        <h2 className={styles.subtitulo}>6. Dicas Extras</h2>
        <ul>
          <li>Use o calendário para visualizar vencimentos futuros.</li>
          <li>Personalize categorias conforme sua necessidade.</li>
          <li>Consulte o histórico para revisar movimentações antigas.</li>
        </ul>
      </div>
    </div>
  );
}