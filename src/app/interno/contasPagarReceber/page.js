"use client";
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from '../../styles/contasPagarReceber.module.css';
import { DataGrid } from '@mui/x-data-grid';

export default function ContasPagarReceberPage() {
  const [dadosTabela, setDadosTabela] = useState([
    {
      id: 1,
      nome: "João Silva",
      descricao: "1.1.1. Dízimos",
      tipo: "Receita",
      status: "Baixado",
      data: "03/11/2025",
      valor: 100,
      categoria: "Dízimos",
      formaPagamento: "Pix",
      vencimento: "03/11/2025",
      observacao: "Recebido em conta corrente"
    },
    {
      id: 2,
      nome: "Padaria Pão Doce",
      descricao: "2. Despesas",
      tipo: "Despesa",
      status: "Baixado",
      data: "05/11/2025",
      valor: 50,
      categoria: "Alimentação",
      formaPagamento: "Cartão",
      vencimento: "05/11/2025",
      observacao: "Compra semanal"
    },
    {
      id: 3,
      nome: "Ofertas Especiais",
      descricao: "1.1.2. Ofertas",
      tipo: "Receita",
      status: "Baixado",
      data: "10/11/2025",
      valor: 200,
      categoria: "Ofertas",
      formaPagamento: "Dinheiro",
      vencimento: "10/11/2025",
      observacao: ""
    },
    {
      id: 4,
      nome: "Supermercado",
      descricao: "2. Despesas",
      tipo: "Despesa",
      status: "Baixado",
      data: "12/11/2025",
      valor: 80,
      categoria: "Mercado",
      formaPagamento: "Boleto",
      vencimento: "12/11/2025",
      observacao: "Pago antecipado"
    },
  ]);

  const [visualizacao, setVisualizacao] = useState('agenda');
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDateClick = (value) => {
    setSelectedDate(value.toDateString());
  };

  const formasPagamento = [
    "Dinheiro",
    "Cartão de Crédito",
    "Cartão de Débito",
    "Pix",
    "Boleto",
    "Transferência",
    "Cheque",
    "Outro"
  ];

  const statusOpcoesDespesa = ["Pago", "Pendente"];
  const statusOpcoesReceita = ["Recebido", "A receber"];

  const [novoEvento, setNovoEvento] = useState({
    nome: "",
    descricao: "",
    categoria: "",
    formaPagamento: "",
    vencimento: "",
    status: "",
    valor: "",
    tipo: ""
  });

  const [showForm, setShowForm] = useState(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNovoEvento((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddEvent = () => {
    setShowForm(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Converte o valor para número, removendo caracteres não numéricos
    let valorNumerico = Number(
      novoEvento.valor
        .replace(/[^\d,.-]/g, '')
        .replace(',', '.')
    );

    // Ajusta o sinal conforme o tipo
    if (novoEvento.tipo === "Despesa" && valorNumerico > 0) {
      valorNumerico = -valorNumerico;
    }
    if (novoEvento.tipo === "Receita" && valorNumerico < 0) {
      valorNumerico = Math.abs(valorNumerico);
    }

    const data = new Date(selectedDate).toLocaleDateString('pt-BR');
    setDadosTabela(prev => [
      ...prev,
      {
        id: prev.length ? Math.max(...prev.map(i => i.id)) + 1 : 1,
        ...novoEvento,
        valor: valorNumerico,
        data,
        vencimento: novoEvento.vencimento
      }
    ]);
    setNovoEvento({
      nome: "",
      descricao: "",
      categoria: "",
      formaPagamento: formasPagamento[0],
      vencimento: "",
      status: "",
      valor: "",
      tipo: ""
    });
    setShowForm(false);
  };

  const totalReceitas = dadosTabela.filter(i => i.tipo === "Receita").reduce((acc, cur) => acc + cur.valor, 0);
  const totalDespesas = dadosTabela.filter(i => i.tipo === "Despesa").reduce((acc, cur) => acc + cur.valor, 0);
  const saldo = totalReceitas - totalDespesas;

  // Definição das colunas para o DataGrid (adicione editable: true nas colunas que podem ser editadas)
  const columns = [
    { field: 'id', headerName: '#', width: 50 },
    { field: 'nome', headerName: 'Nome', width: 140, editable: true },
    { field: 'descricao', headerName: 'Descrição/Tipo', width: 140, editable: true },
    { field: 'categoria', headerName: 'Categoria', width: 120, editable: true },
    { field: 'formaPagamento', headerName: 'Forma de Pagamento', width: 140, editable: true },
    { field: 'vencimento', headerName: 'Vencimento', width: 110, editable: true },
    { field: 'status', headerName: 'Status', width: 100, editable: true },
    { field: 'data', headerName: 'Data', width: 100, editable: true },
    {
      field: 'valor',
      headerName: 'Valor',
      width: 120,
      editable: true,
      type: 'number',
      valueFormatter: (params) => {
        if (!params.row || typeof params.row.tipo === "undefined") return params.value;
        const valor = Number(params.value);
        const valorFormatado = valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        if (params.row.tipo === "Despesa") {
          return `R$ -${valorFormatado}`;
        }
        return `R$ +${valorFormatado}`;
      },
    },
    { field: 'observacao', headerName: 'Observações', width: 160, editable: true },
  ];

  // Função para atualizar os dados ao editar inline
  const processRowUpdate = (newRow, oldRow) => {
    // Garante que valor é sempre número
    newRow.valor = Number(newRow.valor) || 0;
    setDadosTabela((prev) =>
      prev.map((row) => (row.id === newRow.id ? { ...row, ...newRow } : row))
    );
    return newRow;
  };

  return (
    <>
      <div className={styles.botoesVisualizacao}>
        <button
          className={styles.botaoVisualizacao}
          style={{ background: visualizacao === 'agenda' ? '#1976d2' : '#e0e0e0', color: visualizacao === 'agenda' ? '#fff' : '#16213e' }}
          onClick={() => setVisualizacao('agenda')}
        >
          Agenda
        </button>
        <button
          className={styles.botaoVisualizacao}
          style={{ background: visualizacao === 'tabela' ? '#1976d2' : '#e0e0e0', color: visualizacao === 'tabela' ? '#fff' : '#16213e' }}
          onClick={() => setVisualizacao('tabela')}
        >
          Tabela
        </button>
      </div>
      <div className={styles.container}>
        {visualizacao === 'agenda' ? (
          <>
            <div className={styles.calendarioSectionFull}>
              {isClient && (
                <Calendar
                  onChange={setDate}
                  value={date}
                  onClickDay={handleDateClick}
                  className={styles.calendarioGrande}
                />
              )}
            </div>
            {selectedDate && isClient && (
              <div className={styles.agendaSidebar}>
                <h3>
                  Eventos em {new Date(selectedDate).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h3>
                <ul>
                  {dadosTabela
                    .filter(item => item.data === new Date(selectedDate).toLocaleDateString('pt-BR'))
                    .map((item) => (
                      <li key={item.id} style={{ marginBottom: 16, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
                        <div><strong>Nome:</strong> {item.nome}</div>
                        <div><strong>Descrição:</strong> {item.descricao}</div>
                        <div><strong>Categoria:</strong> {item.categoria}</div>
                        <div><strong>Forma de Pagamento:</strong> {item.formaPagamento}</div>
                        <div><strong>Vencimento:</strong> {item.vencimento}</div>
                        <div><strong>Status:</strong> {item.status}</div>
                        <div><strong>Data:</strong> {item.data}</div>
                        <div>
                          <strong>Valor:</strong> {item.tipo === "Despesa"
                            ? `R$ -${Number(item.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                            : `R$ +${Number(item.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                        </div>
                        <div><strong>Observação:</strong> {item.observacao}</div>
                      </li>
                    ))}
                </ul>
                {showForm ? (
                  <form onSubmit={handleFormSubmit} className={styles.formularioEvento}>
                    <div>
                      <label>Nome:</label>
                      <input name="nome" value={novoEvento.nome} onChange={handleFormChange} />
                    </div>
                    <div>
                      <label>Descrição:</label>
                      <input name="descricao" value={novoEvento.descricao} onChange={handleFormChange} />
                    </div>
                    <div>
                      <label>Categoria:</label>
                      <input name="categoria" value={novoEvento.categoria} onChange={handleFormChange} />
                    </div>
                    <div>
                      <label>Forma de Pagamento:</label>
                      <select name="formaPagamento" value={novoEvento.formaPagamento} onChange={handleFormChange}>
                        <option value="">Selecione</option>
                        {formasPagamento.map(fp => <option key={fp} value={fp}>{fp}</option>)}
                      </select>
                    </div>
                    <div>
                      <label>Vencimento:</label>
                      <input name="vencimento" type="date" value={novoEvento.vencimento} onChange={handleFormChange} />
                    </div>
                    <div>
                      <label>Tipo:</label>
                      <select
                        name="tipo"
                        value={novoEvento.tipo}
                        onChange={e => {
                          setNovoEvento(prev => ({
                            ...prev,
                            tipo: e.target.value,
                            status: ""
                          }));
                        }}
                      >
                        <option value="">Selecione</option>
                        <option value="Receita">Receita</option>
                        <option value="Despesa">Despesa</option>
                      </select>
                    </div>
                    {novoEvento.tipo === "Despesa" && (
                      <div>
                        <label>Status:</label>
                        <select name="status" value={novoEvento.status} onChange={handleFormChange}>
                          <option value="">Selecione</option>
                          {statusOpcoesDespesa.map(st => <option key={st} value={st}>{st}</option>)}
                        </select>
                      </div>
                    )}
                    {novoEvento.tipo === "Receita" && (
                      <div>
                        <label>Status:</label>
                        <select name="status" value={novoEvento.status} onChange={handleFormChange}>
                          <option value="">Selecione</option>
                          {statusOpcoesReceita.map(st => <option key={st} value={st}>{st}</option>)}
                        </select>
                      </div>
                    )}
                    <div>
                      <label>Valor:</label>
                      <input
                        name="valor"
                        value={novoEvento.valor}
                        onChange={handleFormChange}
                        placeholder="R$ 0,00"
                      />
                    </div>
                    <div className={styles.botoes}>
                      <button type="submit" className={`${styles.salvar} salvar`}>Salvar</button>
                      <button type="button" className={`${styles.cancelar} cancelar`} onClick={() => setShowForm(false)}>Cancelar</button>
                    </div>
                  </form>
                ) : (
                  <button className={styles.botao} onClick={handleAddEvent}>Adicionar Evento</button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className={styles.tabelaSectionFull}>
            <div className={styles.tabelaCentralizada}>
              <div>
                {isClient && (
                  <DataGrid
                    rows={dadosTabela}
                    columns={columns}
                    autoHeight
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    disableSelectionOnClick
                    processRowUpdate={processRowUpdate}
                    experimentalFeatures={{ newEditingApi: true }}
                    getRowClassName={(params) =>
                      params.row.tipo === "Despesa"
                        ? styles.linhaDespesa
                        : params.row.tipo === "Receita"
                        ? styles.linhaReceita
                        : ""
                    }
                  />
                )}
                <div className={styles.rodapeTabelaVertical}>
                  <span className={styles.receita}>Total Receitas: R$ {totalReceitas.toFixed(2)}</span>
                  <span className={styles.despesa}>Total Despesas: R$ {totalDespesas.toFixed(2)}</span>
                  <span className={styles.saldo}>Saldo: R$ {saldo.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}