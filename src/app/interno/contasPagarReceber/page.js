"use client";
import React, { useState } from 'react';
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
    },
    {
      id: 2,
      nome: "Padaria Pão Doce",
      descricao: "2. Despesas",
      tipo: "Despesa",
      status: "Baixado",
      data: "05/11/2025",
      valor: 50,
    },
    {
      id: 3,
      nome: "Ofertas Especiais",
      descricao: "1.1.2. Ofertas",
      tipo: "Receita",
      status: "Baixado",
      data: "10/11/2025",
      valor: 200,
    },
    {
      id: 4,
      nome: "Supermercado",
      descricao: "2. Despesas",
      tipo: "Despesa",
      status: "Baixado",
      data: "12/11/2025",
      valor: 80,
    },
  ]);

  const [visualizacao, setVisualizacao] = useState('agenda');
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({});

  const handleDateClick = (value) => {
    setSelectedDate(value.toDateString());
  };

  const handleAddEvent = () => {
    const eventDescription = prompt('Digite a descrição do evento:');
    if (eventDescription && selectedDate) {
      setEvents({
        ...events,
        [selectedDate]: [...(events[selectedDate] || []), eventDescription],
      });
    }
  };

  const handleExcluir = (id) => {
    setDadosTabela(dadosTabela.filter(item => item.id !== id));
  };

  const totalReceitas = dadosTabela.filter(i => i.tipo === "Receita").reduce((acc, cur) => acc + cur.valor, 0);
  const totalDespesas = dadosTabela.filter(i => i.tipo === "Despesa").reduce((acc, cur) => acc + cur.valor, 0);
  const saldo = totalReceitas - totalDespesas;

  // Definição das colunas para o DataGrid
  const columns = [
    { field: 'id', headerName: '#', width: 70 },
    { field: 'nome', headerName: 'Nome', width: 180 },
    { field: 'descricao', headerName: 'Descrição/Tipo', width: 180 },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'data', headerName: 'Data', width: 120 },
    {
      field: 'valor',
      headerName: 'Valor',
      width: 120,
      renderCell: (params) =>
        params.row.tipo === "Despesa" ? (
          <span style={{ color: "#c62828" }}>
            - R$ {params.row.valor.toFixed(2)}
          </span>
        ) : (
          <span style={{ color: "#388e3c" }}>
            + R$ {params.row.valor.toFixed(2)}
          </span>
        ),
    },
    {
      field: 'acoes',
      headerName: 'Ações',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <>
          <button
            className={styles.botaoEditar}
            style={{ marginRight: 8, border: 'none', background: 'none', cursor: 'pointer' }}
            title="Editar"
            // onClick={() => ...}
          >✏️</button>
          <button
            className={styles.botaoExcluir}
            style={{ border: 'none', background: 'none', cursor: 'pointer' }}
            title="Excluir"
            onClick={() => handleExcluir(params.row.id)}
          >❌</button>
        </>
      ),
    },
  ];

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
              <Calendar
                onChange={setDate}
                value={date}
                onClickDay={handleDateClick}
                className={styles.calendarioGrande}
              />
            </div>
            {selectedDate && (
              <div className={styles.sidebar}>
                <h3>
                  Eventos em {new Date(selectedDate).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h3>
                <ul>
                  {(events[selectedDate] || []).map((description, index) => (
                    <li key={index}>{description}</li>
                  ))}
                </ul>
                <button className={styles.botao} onClick={handleAddEvent}>Adicionar Evento</button>
              </div>
            )}
          </>
        ) : (
          <div className={styles.tabelaSectionFull}>
            <div className={styles.tabelaCentralizada}>
              <div>
                <DataGrid
                  rows={dadosTabela}
                  columns={columns}
                  autoHeight
                  pageSize={5}
                  rowsPerPageOptions={[5, 10, 20]}
                  disableSelectionOnClick
                  getRowClassName={(params) =>
                    params.row.tipo === "Despesa"
                      ? styles.linhaDespesa
                      : params.row.tipo === "Receita"
                      ? styles.linhaReceita
                      : ""
                  }
                />
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