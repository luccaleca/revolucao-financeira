"use client";
import styles from '../styles/contato.module.css';
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContatoPage() {
  const [form, setForm] = useState({ nome: "", email: "", mensagem: "" });
  const router = useRouter();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    alert("Mensagem enviada! Em breve entraremos em contato.");
    setForm({ nome: "", email: "", mensagem: "" });
  }

  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <button
          className={styles.botaoVoltar}
          onClick={() => router.back()}
        >
          ← Voltar
        </button>
        <h1 className={styles.titulo}>📨 Entrar em Contato</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            Nome
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="Seu nome"
            />
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="seu@email.com"
            />
          </label>
          <label>
            Mensagem
            <textarea
              name="mensagem"
              value={form.mensagem}
              onChange={handleChange}
              required
              className={styles.textarea}
              placeholder="Digite sua mensagem"
              rows={5}
            />
          </label>
          <button type="submit" className={styles.botaoEnviar}>
            Enviar Mensagem
          </button>
        </form>
      </div>
    </div>
  );
}