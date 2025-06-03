"use client";
import React, { useState } from "react";
import { NumericFormat } from "react-number-format";
import styles from '../../styles/dre.module.css';

function CustomStepInput(props) {
  return (
    <input
      {...props}
      type="text"
      inputMode="numeric"
      step="100"
      min="0"
    />
  );
}

export default function DrePage() {
  const [receitaBruta, setReceitaBruta] = useState("");
  const [deducoes, setDeducoes] = useState("");
  const [receitaLiquida, setReceitaLiquida] = useState("");
  const [custo, setCusto] = useState("");
  const [despesas, setDespesas] = useState("");
  const [resultadoOperacional, setResultadoOperacional] = useState("");
  const [outrasReceitas, setOutrasReceitas] = useState("");
  const [outrasDespesas, setOutrasDespesas] = useState("");
  const [lucroLiquido, setLucroLiquido] = useState("");

  // Cálculos automáticos
  React.useEffect(() => {
    const rb = Number(receitaBruta) || 0;
    const ded = Number(deducoes) || 0;
    const rl = rb - ded;
    setReceitaLiquida(rl ? rl.toFixed(2) : "");
  }, [receitaBruta, deducoes]);

  React.useEffect(() => {
    const rl = Number(receitaLiquida) || 0;
    const cst = Number(custo) || 0;
    const desp = Number(despesas) || 0;
    const or = Number(outrasReceitas) || 0;
    const od = Number(outrasDespesas) || 0;
    const resultado = rl - cst - desp + or - od;
    setResultadoOperacional(resultado ? resultado.toFixed(2) : "");
    setLucroLiquido(resultado ? resultado.toFixed(2) : "");
  }, [receitaLiquida, custo, despesas, outrasReceitas, outrasDespesas]);

  return (
    <div className={styles.dreContainer}>
      <div className={styles.dreTitle}>Demonstração do Resultado do Exercício (DRE)</div>
      <div className={styles.dreSubtitle}>
        Preencha os campos abaixo para visualizar o resultado financeiro da empresa.<br />
        <span style={{ color: "#1976d2" }}>Todos os valores devem ser informados em reais (R$).</span>
      </div>
      <form className={styles.dreForm} autoComplete="off">
        <div className={styles.dreField}>
          <label className={styles.dreLabel}>Receita Bruta</label>
          <span className={styles.dreHint}>Total das vendas antes de descontos e impostos.</span>
          <div className={styles.dreInput}>
            <NumericFormat
              value={receitaBruta}
              onValueChange={values => setReceitaBruta(values.floatValue || "")}
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
        </div>
        <div className={styles.dreField}>
          <label className={styles.dreLabel}>Deduções (Impostos, Devoluções)</label>
          <span className={styles.dreHint}>Impostos sobre vendas, devoluções e descontos concedidos.</span>
          <div className={styles.dreInput}>
            <NumericFormat
              value={deducoes}
              onValueChange={values => setDeducoes(values.floatValue || "")}
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
        </div>
        <div className={styles.dreField}>
          <label className={styles.dreLabel}><strong>Receita Líquida</strong></label>
          <span className={styles.dreHint}>Receita Bruta menos Deduções.</span>
          <div className={styles.dreInput}>
            <NumericFormat
              value={receitaLiquida}
              displayType="text"
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              decimalScale={2}
              fixedDecimalScale
              allowLeadingZeros={false}
              customInput={CustomStepInput}
              readOnly
            />
          </div>
        </div>
        <div className={styles.dreField}>
          <label className={styles.dreLabel}>Custo dos Produtos Vendidos (CPV)</label>
          <span className={styles.dreHint}>Custos diretamente relacionados à produção ou compra dos produtos vendidos.</span>
          <div className={styles.dreInput}>
            <NumericFormat
              value={custo}
              onValueChange={values => setCusto(values.floatValue || "")}
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
        </div>
        <div className={styles.dreField}>
          <label className={styles.dreLabel}>Despesas Operacionais</label>
          <span className={styles.dreHint}>Despesas administrativas, comerciais e outras despesas operacionais.</span>
          <div className={styles.dreInput}>
            <NumericFormat
              value={despesas}
              onValueChange={values => setDespesas(values.floatValue || "")}
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
        </div>
        <div className={styles.dreField}>
          <label className={styles.dreLabel}>Outras Receitas</label>
          <span className={styles.dreHint}>Receitas não operacionais, como ganhos eventuais.</span>
          <div className={styles.dreInput}>
            <NumericFormat
              value={outrasReceitas}
              onValueChange={values => setOutrasReceitas(values.floatValue || "")}
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
        </div>
        <div className={styles.dreField}>
          <label className={styles.dreLabel}>Outras Despesas</label>
          <span className={styles.dreHint}>Despesas não operacionais, como perdas eventuais.</span>
          <div className={styles.dreInput}>
            <NumericFormat
              value={outrasDespesas}
              onValueChange={values => setOutrasDespesas(values.floatValue || "")}
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
        </div>
        <div className={styles.dreField}>
          <label className={styles.dreLabel}><strong>Resultado Operacional / Lucro Líquido</strong></label>
          <span className={styles.dreHint}>Receita Líquida - CPV - Despesas + Outras Receitas - Outras Despesas.</span>
          <div className={styles.dreTotal}>
            <NumericFormat
              value={lucroLiquido}
              displayType="text"
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              decimalScale={2}
              fixedDecimalScale
              allowLeadingZeros={false}
              customInput={CustomStepInput}
              readOnly
            />
          </div>
        </div>
      </form>
    </div>
  );
}