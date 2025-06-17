'use client';

import React, { useState } from 'react';
import styles from '../../styles/dre.module.css';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const meses = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

const campos = [
  { key: 'receitaBruta', label: 'Receita Bruta' },
  { key: 'deducoes', label: 'Deduções' },
  { key: 'cpv', label: 'CPV' },
  { key: 'despesasAdm', label: 'Despesas Adm.' },
  { key: 'despesasCom', label: 'Despesas Com.' },
  { key: 'outrasDespesasOp', label: 'Outras Desp. Op.' },
  { key: 'resultadoFinanceiro', label: 'Resultado Financeiro' },
  { key: 'impostos', label: 'Impostos' },
];

function inicializarDados() {
  const obj = {};
  campos.forEach(c => obj[c.key] = Array(12).fill(''));
  return obj;
}

export default function DrePage() {
  const [dados, setDados] = useState(inicializarDados());
  const [inicio, setInicio] = useState(0);
  const [fim, setFim] = useState(11);
  const [mostrarRelatorio, setMostrarRelatorio] = useState(false);

  // Só os meses do intervalo
  const mesesIntervalo = meses.slice(inicio, fim + 1);

  // Cálculos automáticos só para o intervalo
  const receitaLiquida = dados.receitaBruta.map((v, i) =>
    (Number(v) || 0) - (Number(dados.deducoes[i]) || 0)
  );
  const lucroBruto = receitaLiquida.map((v, i) =>
    v - (Number(dados.cpv[i]) || 0)
  );
  const despesasOp = dados.despesasAdm.map((_, i) =>
    (Number(dados.despesasAdm[i]) || 0) +
    (Number(dados.despesasCom[i]) || 0) +
    (Number(dados.outrasDespesasOp[i]) || 0)
  );
  const ebit = lucroBruto.map((v, i) => v - despesasOp[i]);
  const resultadoAntesImpostos = ebit.map((v, i) => v + (Number(dados.resultadoFinanceiro[i]) || 0));
  const lucroLiquido = resultadoAntesImpostos.map((v, i) => v - (Number(dados.impostos[i]) || 0));

  // Funções só para o intervalo
  function arrIntervalo(arr) {
    return arr.slice(inicio, fim + 1);
  }
  function somaPeriodo(arr) {
    return arrIntervalo(arr).reduce((acc, v) => acc + (Number(v) || 0), 0);
  }
  function mediaPeriodo(arr) {
    const periodo = arrIntervalo(arr);
    return periodo.length ? somaPeriodo(arr) / periodo.length : 0;
  }

  // Margens
  const margemBruta = mediaPeriodo(lucroBruto) / (mediaPeriodo(receitaLiquida) || 1) * 100;
  const margemEbit = mediaPeriodo(ebit) / (mediaPeriodo(receitaLiquida) || 1) * 100;
  const margemLiquida = mediaPeriodo(lucroLiquido) / (mediaPeriodo(receitaLiquida) || 1) * 100;

  function handleChange(campo, idx, valor) {
    setDados(d => ({
      ...d,
      [campo]: d[campo].map((v, i) => (i === idx ? valor : v))
    }));
  }

  // Dados do gráfico só para o intervalo
  const chartData = {
    labels: mesesIntervalo,
    datasets: [
      {
        label: 'Receita Líquida',
        data: arrIntervalo(receitaLiquida),
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25,118,210,0.1)',
        tension: 0.3,
      },
      {
        label: 'Lucro Líquido',
        data: arrIntervalo(lucroLiquido),
        borderColor: '#43a047',
        backgroundColor: 'rgba(67,160,71,0.1)',
        tension: 0.3,
      }
    ]
  };

  return (
    <div className={styles.dreContainer} style={{width: '100%', maxWidth: 1100, margin: '40px auto', padding: 32}}>
      {/* Intervalo de meses e botão */}
      <div style={{display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap'}}>
        <span style={{fontWeight: 600, color: '#1976d2'}}>Intervalo:</span>
        <select value={inicio} onChange={e => {
          const novoInicio = Number(e.target.value);
          setInicio(novoInicio);
          if (novoInicio > fim) setFim(novoInicio);
        }}>
          {meses.map((m, i) => <option key={m} value={i}>{m}</option>)}
        </select>
        <span>até</span>
        <select value={fim} onChange={e => {
          const novoFim = Number(e.target.value);
          setFim(novoFim);
          if (novoFim < inicio) setInicio(novoFim);
        }}>
          {meses.map((m, i) => i >= inicio && <option key={m} value={i}>{m}</option>)}
        </select>
        <button
          className={styles.gerarRelatorioBtn}
          onClick={() => setMostrarRelatorio(true)}
          style={{padding: '10px 28px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: 'pointer'}}
        >
          Gerar Relatório
        </button>
      </div>

      {/* Tabela DRE só com os meses do intervalo */}
      <table className={styles.dreReportTable} style={{minWidth: 400, width: '100%', marginBottom: 24}}>
        <thead>
          <tr>
            <th>Conta</th>
            {mesesIntervalo.map((mes, i) => <th key={mes}>{mes}</th>)}
          </tr>
        </thead>
        <tbody>
          {campos.map(campo => (
            <tr key={campo.key}>
              <td>{campo.label}</td>
              {mesesIntervalo.map((_, idx) => (
                <td key={idx + inicio}>
                  <input
                    type="number"
                    value={dados[campo.key][idx + inicio]}
                    onChange={e => handleChange(campo.key, idx + inicio, e.target.value)}
                    style={{width: 70}}
                  />
                </td>
              ))}
            </tr>
          ))}
          <tr style={{background: '#f4f8fb', fontWeight: 600}}>
            <td>Receita Líquida</td>
            {arrIntervalo(receitaLiquida).map((v, i) => (
              <td key={i}>R$ {v.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
            ))}
          </tr>
          <tr style={{background: '#f4f8fb', fontWeight: 600}}>
            <td>Lucro Bruto</td>
            {arrIntervalo(lucroBruto).map((v, i) => (
              <td key={i}>R$ {v.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
            ))}
          </tr>
          <tr style={{background: '#f4f8fb', fontWeight: 600}}>
            <td>EBIT</td>
            {arrIntervalo(ebit).map((v, i) => (
              <td key={i}>R$ {v.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
            ))}
          </tr>
          <tr style={{background: '#f4f8fb', fontWeight: 600}}>
            <td>Lucro Líquido</td>
            {arrIntervalo(lucroLiquido).map((v, i) => (
              <td key={i}>R$ {v.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
            ))}
          </tr>
        </tbody>
      </table>

      {/* Relatório Visual */}
      {mostrarRelatorio && (
        <div className={styles.dreReport} style={{maxWidth: 1000, width: '100%', margin: '0 auto'}}>
          <h2>Relatório do Período: {meses[inicio]} a {meses[fim]}</h2>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'space-between'}}>
            <div style={{flex: 1, minWidth: 220}}>
              <ul>
                <li><strong>Receita Líquida Total:</strong> R$ {somaPeriodo(receitaLiquida).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</li>
                <li><strong>Lucro Bruto Total:</strong> R$ {somaPeriodo(lucroBruto).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</li>
                <li><strong>EBIT Total:</strong> R$ {somaPeriodo(ebit).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</li>
                <li><strong>Lucro Líquido Total:</strong> R$ {somaPeriodo(lucroLiquido).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</li>
                <li><strong>Média Receita Líquida:</strong> R$ {mediaPeriodo(receitaLiquida).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</li>
                <li><strong>Média Lucro Líquido:</strong> R$ {mediaPeriodo(lucroLiquido).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</li>
                <li><strong>Margem Bruta:</strong> {margemBruta.toLocaleString('pt-BR', {maximumFractionDigits: 1})}%</li>
                <li><strong>Margem EBIT:</strong> {margemEbit.toLocaleString('pt-BR', {maximumFractionDigits: 1})}%</li>
                <li><strong>Margem Líquida:</strong> {margemLiquida.toLocaleString('pt-BR', {maximumFractionDigits: 1})}%</li>
              </ul>
            </div>
            <div style={{flex: 2, minWidth: 320, maxWidth: 600}}>
              <Line data={chartData} options={{
                plugins: { legend: { position: 'bottom' } },
                scales: { y: { beginAtZero: true } }
              }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}