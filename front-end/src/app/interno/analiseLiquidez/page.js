"use client";
import React, { useState } from "react";
import { NumericFormat } from "react-number-format";
import styles from '../../styles/analiseLiquidez.module.css';

const historicoInicial = [
  { data: "2025-05", atual: 1.2, reduzida: 0.9 },
  { data: "2025-06", atual: 1.1, reduzida: 0.8 },
];

function getCurrentMonthYear() {
  const now = new Date();
  return now.toISOString().slice(0, 7);
}

export default function AnaliseLiquidezPage() {
  // Detalhamento dos ativos/passivos
  const [caixa, setCaixa] = useState("");
  const [estoque, setEstoque] = useState("");
  // Removido: bancos, fornecedores
  const [impostos, setImpostos] = useState("");
  // Campos principais
  const [ativos, setAtivos] = useState("");
  const [passivos, setPassivos] = useState("");
  const [contasReceber, setContasReceber] = useState("");
  const [contasPagar, setContasPagar] = useState("");
  // Removido: observação
  // Resultados e histórico
  const [resultado, setResultado] = useState(null);
  const [historico, setHistorico] = useState(historicoInicial);
  const [feedback, setFeedback] = useState("");
  const [analises, setAnalises] = useState([]);
  const [analiseSelecionada, setAnaliseSelecionada] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  // Meta
  const [meta, setMeta] = useState(""); // estava 1.2

  function interpretarIndice(valor) {
    if (valor >= 1.5) return { texto: "Excelente! Sua liquidez está saudável.", cor: "#2e7d32" };
    if (valor >= 1.0) return { texto: "Ok, mas atenção a oscilações.", cor: "#fbc02d" };
    if (valor >= 0.8) return { texto: "Atenção: pode faltar liquidez em emergências.", cor: "#ffa000" };
    return { texto: "Crítico! Risco de não honrar compromissos.", cor: "#c62828" };
  }

  function handleCalcular(e) {
    e.preventDefault();
    const ac = parseFloat(ativos.toString().replace(",", ".")) || 0;
    const pc = parseFloat(passivos.toString().replace(",", ".")) || 0;
    const cr = parseFloat(contasReceber.toString().replace(",", ".")) || 0;
    const cp = parseFloat(contasPagar.toString().replace(",", ".")) || 0;
    if (isNaN(ac) || isNaN(pc) || pc === 0) {
      setFeedback("Preencha corretamente Ativos e Passivos Circulantes.");
      setResultado(null);
      return;
    }
    const indiceAtual = ac / pc;
    const indiceReduzida = (ac - cp) / pc;
    setResultado({
      atual: indiceAtual,
      reduzida: indiceReduzida,
      interpretacaoAtual: interpretarIndice(indiceAtual),
      interpretacaoReduzida: interpretarIndice(indiceReduzida),
      ativos: ac,
      passivos: pc,
      contasReceber: cr,
      contasPagar: cp,
      caixa, estoque, impostos,
      data: getCurrentMonthYear(),
    });
    setHistorico([
      ...historico,
      { data: getCurrentMonthYear(), atual: indiceAtual, reduzida: indiceReduzida },
    ]);
    setFeedback("Cálculo realizado com sucesso!");
  }

  function handleSalvarAnalise() {
    if (!resultado) return;
    if (editandoId) {
      setAnalises(analises.map(a => a.id === editandoId ? { ...resultado, id: editandoId } : a));
      setEditandoId(null);
      setFeedback("Análise editada!");
    } else {
      const novaAnalise = { id: Date.now(), ...resultado };
      setAnalises([novaAnalise, ...analises]);
      setAnaliseSelecionada(novaAnalise.id);
      setFeedback("Análise salva!");
    }
  }

  function handleSelecionarAnalise(id) {
    const analise = analises.find(a => a.id === id);
    if (analise) {
      setAtivos(analise.ativos);
      setPassivos(analise.passivos);
      setContasReceber(analise.contasReceber);
      setContasPagar(analise.contasPagar);
      setCaixa(analise.caixa || "");
      setEstoque(analise.estoque || "");
      setImpostos(analise.impostos || "");
      setResultado(analise);
      setAnaliseSelecionada(id);
      setEditandoId(null);
      setFeedback("");
    }
  }

  function handleEditarAnalise(id) {
    handleSelecionarAnalise(id);
    setEditandoId(id);
  }

  function handleExcluirAnalise(id) {
    setAnalises(analises.filter(a => a.id !== id));
    if (analiseSelecionada === id) {
      setAnaliseSelecionada(null);
      setResultado(null);
      setAtivos(""); setPassivos(""); setContasReceber(""); setContasPagar("");
      setCaixa(""); setEstoque(""); setImpostos("");
    }
    setEditandoId(null);
  }

  // Média dos índices dos últimos 3 análises
  const mediaAtual = analises.length
    ? (analises.slice(0, 3).reduce((s, a) => s + a.atual, 0) / Math.min(3, analises.length)).toFixed(2)
    : null;

  // Gráfico simples com SVG (linha para cada índice)
  function GraficoLinha({ historico }) {
    if (!historico.length) return null;
    const w = 700, h = 320, padding = 40;
    const max = Math.max(...historico.map(x => Math.max(x.atual, x.reduzida, meta)), 2);
    const min = Math.min(...historico.map(x => Math.min(x.atual, x.reduzida, meta)), 0);

    const pontos = (key) =>
      historico.map((p, i) => {
        const x = padding + ((w - 2 * padding) * i) / (historico.length - 1 || 1);
        const y = h - padding - ((h - 2 * padding) * (p[key] - min)) / (max - min || 1);
        return `${x},${y}`;
      }).join(" ");

    // Linha da meta
    const metaY = h - padding - ((h - 2 * padding) * (meta - min)) / (max - min || 1);

    return (
      <div className={styles.graficoLinhaAnalise}>
        <svg width={w} height={h} style={{ background: "none" }}>
          <line x1={padding} y1={h - padding} x2={w - padding} y2={h - padding} stroke="#bbb" />
          <line x1={padding} y1={padding} x2={padding} y2={h - padding} stroke="#bbb" />
          <polyline points={pontos("atual")} fill="none" stroke="#1976d2" strokeWidth="2" />
          <polyline points={pontos("reduzida")} fill="none" stroke="#c62828" strokeWidth="2" />
          {/* Linha da meta */}
          <line x1={padding} y1={metaY} x2={w - padding} y2={metaY} stroke="#43a047" strokeDasharray="6 4" strokeWidth="2" />
          {/* Pontos e datas */}
          {historico.map((p, i) => {
            const x = padding + ((w - 2 * padding) * i) / (historico.length - 1 || 1);
            const y1 = h - padding - ((h - 2 * padding) * (p.atual - min)) / (max - min || 1);
            const y2 = h - padding - ((h - 2 * padding) * (p.reduzida - min)) / (max - min || 1);
            return (
              <g key={i}>
                <circle cx={x} cy={y1} r={3} fill="#1976d2" />
                <circle cx={x} cy={y2} r={3} fill="#c62828" />
                <text x={x} y={h - 8} fontSize={12} textAnchor="middle">{p.data}</text>
              </g>
            );
          })}
          {/* Legenda */}
          <rect x={w - 120} y={10} width={10} height={10} fill="#1976d2" />
          <text x={w - 105} y={19} fontSize={11}>Liquidez Atual</text>
          <rect x={w - 120} y={28} width={10} height={10} fill="#c62828" />
          <text x={w - 105} y={37} fontSize={11}>Liquidez Reduzida</text>
          <rect x={w - 120} y={46} width={10} height={2} fill="#43a047" />
          <text x={w - 105} y={52} fontSize={11}>Meta</text>
        </svg>
      </div>
    );
  }

  function gerarDica(indice) {
    if (indice >= 1.5) {
      return "Ótimo! Sua empresa está com folga financeira. Considere investir ou negociar melhores condições com fornecedores.";
    }
    if (indice >= 1.2) {
      return "Situação confortável. Mantenha o controle e monitore possíveis oscilações.";
    }
    if (indice >= 1.0) {
      return "Atenção: sua liquidez está no limite. Evite novos compromissos sem reforçar o caixa.";
    }
    if (indice >= 0.8) {
      return "Alerta: risco de dificuldades para pagar contas. Reveja estoques e tente antecipar recebíveis.";
    }
    return "Crítico! Alto risco de inadimplência. Busque negociar dívidas, cortar custos e aumentar receitas urgentemente.";
  }

  // Função utilitária para formatar valores em real
  function formatarReal(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  // Função para garantir valor numérico ao salvar
  function parseNumber(val) {
    if (typeof val === "number") return val;
    if (!val) return "";
    return Number(val.toString().replace(/\./g, "").replace(",", "."));
  }

  return (
    <div>
      <form onSubmit={handleCalcular} className={styles.formAnalise}>
        {/* Detalhamento dos ativos */}
        <div className={styles.campoAnalise}>
          <label>Caixa:</label>
          <NumericFormat
            value={caixa}
            onValueChange={values => setCaixa(values.floatValue || "")}
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
        <div className={styles.campoAnalise}>
          <label>Estoque:</label>
          <NumericFormat
            value={estoque}
            onValueChange={values => setEstoque(values.floatValue || "")}
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
        <div className={styles.campoAnalise}>
          <label>Impostos a Pagar:</label>
          <NumericFormat
            value={impostos}
            onValueChange={values => setImpostos(values.floatValue || "")}
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
        <div className={styles.campoAnalise}>
          <label>Total Ativos Circulantes:</label>
          <NumericFormat
            value={ativos}
            onValueChange={values => setAtivos(values.floatValue || "")}
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
        <div className={styles.campoAnalise}>
          <label>Total Passivos Circulantes:</label>
          <NumericFormat
            value={passivos}
            onValueChange={values => setPassivos(values.floatValue || "")}
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
        <div className={styles.campoAnalise}>
          <label>Contas a Receber:</label>
          <NumericFormat
            value={contasReceber}
            onValueChange={values => setContasReceber(values.floatValue || "")}
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
        <div className={styles.campoAnalise}>
          <label>Contas a Pagar:</label>
          <NumericFormat
            value={contasPagar}
            onValueChange={values => setContasPagar(values.floatValue || "")}
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
        <div className={styles.campoAnalise}>
          <label>Meta de Liquidez:</label>
          <NumericFormat
            value={meta}
            onValueChange={values => setMeta(values.floatValue || "")}
            decimalSeparator=","
            allowNegative={false}
            decimalScale={2}
            fixedDecimalScale
            allowLeadingZeros={false}
            placeholder="1,20"
            customInput={CustomStepInput}
          />
        </div>
        <div className={styles.botoesAnalise}>
          <button type="submit">
            Calcular Índices
          </button>
          {resultado && (
            <button type="button" onClick={handleSalvarAnalise}>
              {editandoId ? "Salvar Edição" : "Salvar"}
            </button>
          )}
        </div>
      </form>

      {feedback && (
        <div>
          {feedback}
        </div>
      )}

      {/* Resultados e gráfico lado a lado */}
      {resultado && (
        <div className={styles.resultadoGraficoWrapper}>
          <div className={styles.resultadoAnalise}>
            <h3>Resultados</h3>
            <div>
              <strong>Índice de Liquidez Atual:</strong> {resultado.atual.toFixed(2)}<br />
              <span style={{ color: resultado.interpretacaoAtual.cor }}>
                {resultado.interpretacaoAtual.texto}
              </span>
            </div>
            <div>
              <strong>Índice de Liquidez Reduzida:</strong> {resultado.reduzida.toFixed(2)}<br />
              <span style={{ color: resultado.interpretacaoReduzida.cor }}>
                {resultado.interpretacaoReduzida.texto}
              </span>
            </div>
            <div>
              <strong>Data da Análise:</strong> {resultado.data}
            </div>
            {/* Breakdown dos ativos/passivos */}
            <div style={{ marginTop: 12 }}>
              <strong>Detalhamento:</strong>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                <li>Caixa: {formatarReal(resultado.caixa)}</li>
                <li>Estoque: {formatarReal(resultado.estoque)}</li>
                <li>Impostos: {formatarReal(resultado.impostos)}</li>
              </ul>
            </div>
            {/* Comparativo com média/meta */}
            <div style={{ marginTop: 12 }}>
              <strong>Média dos últimos 3 índices:</strong> {mediaAtual}
              <br />
              <strong>Meta:</strong> {meta}
              <br />
              {resultado.atual >= meta
                ? <span style={{ color: "#2e7d32" }}>Acima da meta!</span>
                : <span style={{ color: "#c62828" }}>Abaixo da meta!</span>
              }
            </div>
            {/* Dica automática */}
            <div style={{ marginTop: 12, color: "#1976d2" }}>
              {gerarDica(resultado.atual)}
            </div>
          </div>
          <div>
            <GraficoLinha historico={historico} />
          </div>
        </div>
      )}

      {/* Vitrine de análises salvas */}
      {analises.length > 0 && (
        <div className={styles.vitrineAnalises}>
          <h4>Vitrine de Análises Salvas</h4>
          <div className={styles.cardsAnalises}>
            {analises.map(a => (
              <div
                key={a.id}
                className={`${styles.cardAnalise} ${analiseSelecionada === a.id ? styles.cardSelecionado : ""}`}
                onClick={() => handleSelecionarAnalise(a.id)}
              >
                <button
                  className={styles.excluirAnalise}
                  onClick={e => {
                    e.stopPropagation();
                    handleExcluirAnalise(a.id);
                  }}
                  title="Excluir análise"
                >×</button>
                <button
                  className={styles.editarAnalise}
                  onClick={e => {
                    e.stopPropagation();
                    handleEditarAnalise(a.id);
                  }}
                  title="Editar análise"
                  style={{ position: "absolute", top: 6, right: 38, background: "transparent", border: "none", color: "#1976d2", fontSize: "1.1rem", cursor: "pointer" }}
                >✎</button>
                <div><strong>Data:</strong> {a.data}</div>
                <div><strong>Ativos:</strong> {formatarReal(a.ativos)}</div>
                <div><strong>Passivos:</strong> {formatarReal(a.passivos)}</div>
                <div><strong>Receber:</strong> {formatarReal(a.contasReceber)}</div>
                <div><strong>Pagar:</strong> {formatarReal(a.contasPagar)}</div>
                <div><strong>Atual:</strong> {a.atual.toFixed(2)}</div>
                <div><strong>Reduzida:</strong> {a.reduzida.toFixed(2)}</div>
                {/* Removido: Observação */}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Componente auxiliar para step de 100
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