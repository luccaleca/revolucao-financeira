"use client"; // Indica que este é um componente do lado do cliente
import styles from '../styles/login.module.css';
import { useRouter } from 'next/navigation'; // Importa o hook

export default function LoginPage() {
  const router = useRouter(); // Inicializa o roteador

  function handleSubmit(e) {
    e.preventDefault(); // Evita o reload da página
    router.push('/home'); // Redireciona para /home
  }

  return (
    <div className={styles.wrapper}>
      {/* Seção de Login */}
      <div className={styles.loginContainer}>
        <div className={styles.loginContent}>
          <h1>Bem-vindo(a) ao Controle Financeiro</h1>
          <p>Faça login para continuar</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputWrapper}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="seuemail@exemplo.com" />
            </div>

            <div className={styles.inputWrapper}>
              <label htmlFor="password">Senha</label>
              <input type="password" id="password" placeholder="********" />
            </div>

            <div className={styles.options}>
              <a href="/forgot-password">Esqueceu a senha?</a>
            </div>

            <button type="submit" className={styles.submitButton}>Entrar</button>
          </form>

          <div className={styles.registerPrompt}>
            Não tem uma conta? <a href="/register">Cadastre-se aqui</a>
          </div>
        </div>
      </div>

      {/* Seção de Imagem */}
      <div className={styles.imageContainer}>
        <img
          src="/images/carrosel-2.jpg"
          alt="Finanças Corporativas"
          className={styles.image}
        />
      </div>
    </div>
  );
}