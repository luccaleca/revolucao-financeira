"use client";
import React, { useState, useEffect } from "react";
import styles from '../../styles/bot.module.css';

export default function BotAgendamento() {
  const [mensagens, setMensagens] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [novaMsg, setNovaMsg] = useState("");
  const [horario, setHorario] = useState("");
  const [data, setData] = useState("");
  const [numeroDestino, setNumeroDestino] = useState(""); // Novo campo
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Carregar mensagens ao abrir a página
  useEffect(() => {
    carregarMensagens();
  }, []);

  const carregarMensagens = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3333/api/bot-mensagens");
      if (!response.ok) throw new Error('Erro ao carregar mensagens');
      const data = await response.json();
      setMensagens(data);
      setError("");
    } catch (err) {
      setError("Erro ao carregar mensagens: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Salvar mensagens na API
  const salvarMensagens = async (novasMensagens) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3333/api/bot-mensagens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novasMensagens),
      });
      
      if (!response.ok) throw new Error('Erro ao salvar mensagens');
      
      setMensagens(novasMensagens);
      setError("");
    } catch (err) {
      setError("Erro ao salvar mensagens: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSalvar = () => {
    if (!novaMsg.trim() || !horario || !data || !numeroDestino.trim()) {
      setError("Preencha todos os campos!");
      return;
    }
    
    const novas = [...mensagens, { 
      texto: novaMsg, 
      horario, 
      data, 
      numeroDestino: numeroDestino.replace(/\D/g, '') // Remove caracteres não numéricos
    }];
    
    salvarMensagens(novas);
    handleCancelar();
  };

  const handleCancelar = () => {
    setNovaMsg("");
    setHorario("");
    setData("");
    setNumeroDestino("");
    setShowForm(false);
    setError("");
  };

  const removerMensagem = (index) => {
    const novas = mensagens.filter((_, idx) => idx !== index);
    salvarMensagens(novas);
  };

  return (
    <div className={styles.botContainer}>
      <h2 className={styles.botTitle}>Mensagens Agendadas do Bot</h2>
      
      {error && (
        <div className={styles.botError}>
          {error}
        </div>
      )}
      
      {loading && <div className={styles.botLoading}>Carregando...</div>}
      
      <div className={styles.botMensagensGrid}>
        {mensagens.map((msg, idx) => (
          <div key={idx} className={styles.botMensagemCard}>
            <span>{msg.texto}</span>
            <span className={styles.botMensagemHorario}>
              📅 {msg.data} ⏰ {msg.horario}
            </span>
            <span className={styles.botMensagemNumero}>
              📱 {msg.numeroDestino}
            </span>
            <button 
              className={styles.botRemoveButton}
              onClick={() => removerMensagem(idx)}
              title="Remover mensagem"
            >
              ❌
            </button>
          </div>
        ))}
      </div>

      {/* Botão de adicionar */}
      {!showForm && (
        <button
          className={styles.botAddButton}
          onClick={() => setShowForm(true)}
          aria-label="Adicionar mensagem"
          disabled={loading}
        >
          +
        </button>
      )}

      {/* Formulário flutuante */}
      {showForm && (
        <div className={styles.botFormModal}>
          <textarea
            className={styles.botFormTextarea}
            placeholder="Mensagem do bot"
            value={novaMsg}
            onChange={e => setNovaMsg(e.target.value)}
          />
          <input
            className={styles.botFormInput}
            type="text"
            placeholder="Número do WhatsApp (ex: 5511999999999)"
            value={numeroDestino}
            onChange={e => setNumeroDestino(e.target.value)}
          />
          <input
            className={styles.botFormInput}
            type="date"
            value={data}
            onChange={e => setData(e.target.value)}
          />
          <input
            className={styles.botFormInput}
            type="time"
            value={horario}
            onChange={e => setHorario(e.target.value)}
          />
          <div className={styles.botFormActions}>
            <button
              className={styles.botFormCancel}
              onClick={handleCancelar}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              className={styles.botFormSave}
              onClick={handleSalvar}
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}