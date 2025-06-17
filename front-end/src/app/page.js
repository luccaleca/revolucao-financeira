"use client";
import { useState, useEffect } from "react";
import styles from '../app/styles/login.module.css';
import { useRouter } from 'next/navigation';

const imagensCarrosel = [
  {
    src: "/images/juro-medio.webp",
    alt: "Juro Médio",
    texto: "Juro médio no rotativo do cartão cai 0,4 pp em abril, para 443,3% ao ano, diz BC"
  },
  {
    src: "/images/recomendacao-b3.webp",
    alt: "Recomendação B3",
    texto: "UBS BB corta recomendação da B3 para neutra, por potencial limitado de valorização"
  },
  {
    src: "/images/estoque-petroleo.webp",
    alt: "Estoque de Petróleo",
    texto: "Estoques de petróleo dos EUA caem 2,795 milhões de barris, aponta DoE"
  },
  {
    src: "/images/dolar-recua.webp",
    alt: "Dólar recua",
    texto: "Dólar hoje recua a R$ 5,65 com bloqueio de tarifas de Trump e dados no Brasil e EUA"
  },
  {
    src: "/images/ceo-nvidia.webp",
    alt: "CEO Nvidia",
    texto: "CEO da Nvidia, Jensen Huang vai vender US$ 800 milhões em ações da companhia"
  },
  {
    src: "/images/ibovespa.webp",
    alt: "Ibovespa",
    texto: "Ibovespa Ao Vivo: Bolsa cai com repercussão de dados do Brasil e dos EUA"
  },
  {
    src: "/images/elon-musk-trump.webp",
    alt: "Elon Musk e Trump",
    texto: "Musk oficializa saída do governo Trump — e ações da Tesla voltam a subir"
  },
  {
    src: "/images/lucros-trump.webp",
    alt: "Lucros Trump",
    texto: "Lucros corporativos dos EUA diminuem com força no 1º tri, sob influência de Trump"
  }
];

export default function LoginPage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % imagensCarrosel.length);
    }, 10000); // 10 segundos
    return () => clearInterval(timer);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    router.push('interno/home');
  }

  return (
    <div className={styles.wrapper}>
      {/* Seção de Login */}
      <div className={styles.loginContainer}>
        <div className={styles.loginContent}>
          <div className={styles.logoContainer}>
            <img
              src="/images/logo.png"
              alt="Logo Revolução Financeira"
              className={styles.logo}
            />
          </div>
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
              <a href="/esqueceu-senha">Esqueceu a senha?</a>
            </div>

            <button type="submit" className={styles.submitButton}>Entrar</button>
          </form>

          <div className={styles.registerPrompt}>
            Não tem uma conta? <a href="/registrar">Cadastre-se aqui</a>
          </div>
        </div>
      </div>

      {/* Carrossel de Imagens */}
      <div className={styles.imageContainer}>
        <img
          src={imagensCarrosel[index].src}
          alt={imagensCarrosel[index].alt}
          className={styles.image}
          key={imagensCarrosel[index].src}
        />
        <div className={styles.imageCaption}>
          <span className={styles.categoria}>Mercados</span>
          <span className={styles.texto}>{imagensCarrosel[index].texto}</span>
        </div>
      </div>
    </div>
  );
}