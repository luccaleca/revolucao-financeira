"use client";
import React, { useState } from "react";
import { NumericFormat } from "react-number-format";
import styles from "../../styles/planejamentoOrcamentario.module.css";

function CustomStepInput(props) {
  return (
    <input
      {...props}
      type="text"
      inputMode="numeric"
      step="100"
      min="0"
      style={{ width: "100%" }}
    />
  );
}

export default function PlanejamentoOrcamentarioPage() {
  const [metaReceita, setMetaReceita] = useState("");
  const [metaDespesa, setMetaDespesa] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [planejamentos, setPlanejamentos] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [realReceita, setRealReceita] = useState("");
  const [realDespesa, setRealDespesa] = useState("");

  // Cálculo dos percentuais e balanço
  const receita = Number(metaReceita) || 0;
  const despesa = Number(metaDespesa) || 0;
  const total = receita + despesa;
  const percReceita = total ? Number(((receita / total) * 100).toFixed(1)) : 0;
  const percDespesa = total ? Number(((despesa / total) * 100).toFixed(1)) : 0;
  const saldo = receita - despesa;
  const percSaldo = total ? Number(((saldo / total) * 100).toFixed(1)) : 0;

  function handleSalvar(e) {
    e.preventDefault();
    if (!metaReceita || !metaDespesa || !periodo) {
      setFeedback("Preencha todos os campos.");
      return;
    }
    setPlanejamentos([
      ...planejamentos,
      {
        id: Date.now(),
        periodo,
        metaReceita: receita,
        metaDespesa: despesa,
        percReceita,
        percDespesa,
        percSaldo,
        saldo,
      },
    ]);
    setFeedback("Planejamento salvo com sucesso!");
    setMetaReceita("");
    setMetaDespesa("");
    setPeriodo("");
  }

  // Gráfico de pizza simples
  function GraficoPizza() {
    // Cores: Receita (azul), Despesa (vermelho), Saldo (verde/cinza)
    const r = 60, cx = 80, cy = 80;
    const receitaAng = (percReceita / 100) * 360;
    const despesaAng = (percDespesa / 100) * 360;
    // Saldo pode ser positivo ou negativo
    const saldoAng = 360 - receitaAng - despesaAng;

    // Função para arco SVG
    function describeArc(startAngle, endAngle, color) {
      const start = polarToCartesian(cx, cy, r, endAngle);
      const end = polarToCartesian(cx, cy, r, startAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
      const d = [
        "M", start.x, start.y,
        "A", r, r, 0, largeArcFlag, 0, end.x, end.y,
        "L", cx, cy, "Z"
      ].join(" ");
      return <path d={d} fill={color} />;
    }
    function polarToCartesian(cx, cy, r, angle) {
      const a = ((angle - 90) * Math.PI) / 180.0;
      return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
    }

    let saldoColor = saldo >= 0 ? "#43a047" : "#757575";

    return (
      <svg width={160} height={160}>
        {describeArc(0, receitaAng, "#1976d2")}
        {describeArc(receitaAng, receitaAng + despesaAng, "#c62828")}
        {saldoAng > 0 && describeArc(receitaAng + despesaAng, 360, saldoColor)}
        <circle cx={80} cy={80} r={40} fill="#fff" />
        <text x={80} y={85} textAnchor="middle" fontSize="18" fontWeight="bold">
          {percSaldo}%
        </text>
        <text x={80} y={105} textAnchor="middle" fontSize="12" fill="#757575">
          Balanço
        </text>
      </svg>
    );
  }

  return (
    <div className={styles.container}>
      <h2>Planejamento Orçamentário</h2>

      {/* Painel detalhado */}
      <div className={styles.painelDetalhado}>
        <div>
          <strong>Receita:</strong> R$ {metaReceita || "--"} <span style={{ color: "#1976d2" }}>({percReceita}%)</span>
        </div>
        <div>
          <strong>Despesa:</strong> R$ {metaDespesa || "--"} <span style={{ color: "#c62828" }}>({percDespesa}%)</span>
        </div>
        <div>
          <strong>Balanço:</strong>{" "}
          <span style={{ color: saldo >= 0 ? "#43a047" : "#c62828" }}>
            R$ {saldo !== 0 ? saldo.toFixed(2) : "--"} ({percSaldo}%)
          </span>
        </div>
        <div>
          <strong>Receita Real:</strong> R$ {realReceita || "--"}
          {realReceita && metaReceita && (
            <span style={{ color: realReceita < metaReceita ? "#c62828" : "#43a047", marginLeft: 8 }}>
              ({((realReceita - metaReceita) / metaReceita * 100).toFixed(1)}%)
            </span>
          )}
        </div>
        <div>
          <strong>Despesa Real:</strong> R$ {realDespesa || "--"}
          {realDespesa && metaDespesa && (
            <span style={{ color: realDespesa > metaDespesa ? "#c62828" : "#43a047", marginLeft: 8 }}>
              ({((realDespesa - metaDespesa) / metaDespesa * 100).toFixed(1)}%)
            </span>
          )}
        </div>
        {/* Resultado do balanço real em reais */}
        {(realReceita && realDespesa) && (
          <div>
            <strong>Balanço Real:</strong>{" "}
            <span style={{ color: (realReceita - realDespesa) >= 0 ? "#43a047" : "#c62828" }}>
              R$ {(realReceita - realDespesa).toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Gráfico de pizza */}
      <div className={styles.graficoPizzaWrapper}>
        <GraficoPizza />
        <div className={styles.legendaPizza}>
          <div><span style={{ background: "#1976d2" }} /> Receita</div>
          <div><span style={{ background: "#c62828" }} /> Despesa</div>
          <div><span style={{ background: saldo >= 0 ? "#43a047" : "#757575" }} /> Balanço</div>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSalvar} className={styles.formPlanejamento}>
        <div>
          <label>Meta de Receita:</label>
          <NumericFormat
            value={metaReceita}
            onValueChange={values => setMetaReceita(values.floatValue || "")}
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            allowNegative={false}
            decimalScale={2}
            fixedDecimalScale
            allowLeadingZeros={false}
            placeholder="R$ 0,00"
            customInput={CustomStepInput}
            required
          />
        </div>
        <div>
          <label>Meta de Despesa:</label>
          <NumericFormat
            value={metaDespesa}
            onValueChange={values => setMetaDespesa(values.floatValue || "")}
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            allowNegative={false}
            decimalScale={2}
            fixedDecimalScale
            allowLeadingZeros={false}
            placeholder="R$ 0,00"
            customInput={CustomStepInput}
            required
          />
        </div>
        <div>
          <label>Período:</label>
          <input type="month" value={periodo} onChange={e => setPeriodo(e.target.value)} required />
        </div>
        <div>
          <label>Receita Realizada:</label>
          <NumericFormat
            value={realReceita}
            onValueChange={values => setRealReceita(values.floatValue || "")}
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            allowNegative={false}
            decimalScale={2}
            fixedDecimalScale
            allowLeadingZeros={false}
            placeholder="R$ 0,00"
            customInput={CustomStepInput}
          />
        </div>
        <div>
          <label>Despesa Realizada:</label>
          <NumericFormat
            value={realDespesa}
            onValueChange={values => setRealDespesa(values.floatValue || "")}
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            allowNegative={false}
            decimalScale={2}
            fixedDecimalScale
            allowLeadingZeros={false}
            placeholder="R$ 0,00"
            customInput={CustomStepInput}
          />
        </div>
        <button type="submit">Salvar Planejamento</button>
      </form>

      {feedback && <div className={styles.feedback}>{feedback}</div>}

      {/* Alerta inteligente */}
      {realReceita && metaReceita && realReceita < metaReceita * 0.9 && (
        <div className={styles.alerta}>
          Receita realizada está mais de 10% abaixo da meta! Considere reforçar ações de vendas.
        </div>
      )}
      {realDespesa && metaDespesa && realDespesa > metaDespesa * 1.1 && (
        <div className={styles.alerta}>
          Despesa realizada está mais de 10% acima da meta! Reveja seus gastos.
        </div>
      )}

      {/* Histórico de planejamentos */}
      {planejamentos.length > 0 && (
        <div className={styles.historicoPainel}>
          <h4>Histórico de Planejamentos</h4>
          <table>
            <thead>
              <tr>
                <th>Período</th>
                <th>Receita</th>
                <th>% Receita</th>
                <th>Despesa</th>
                <th>% Despesa</th>
                <th>Balanço</th>
                <th>% Balanço</th>
              </tr>
            </thead>
            <tbody>
              {planejamentos.map(p => (
                <tr key={p.id}>
                  <td>{p.periodo}</td>
                  <td>R$ {p.metaReceita}</td>
                  <td>{Number(p.percReceita).toFixed(1)}%</td>
                  <td>R$ {p.metaDespesa}</td>
                  <td>{Number(p.percDespesa).toFixed(1)}%</td>
                  <td style={{ color: p.saldo >= 0 ? "#43a047" : "#c62828" }}>R$ {p.saldo}</td>
                  <td>{Number(p.percSaldo).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}