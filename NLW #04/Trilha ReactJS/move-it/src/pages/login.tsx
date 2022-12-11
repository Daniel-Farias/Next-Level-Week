import styles from '../styles/pages/Login.module.css';
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

interface Profile{
  data: {
    login: string;
    name: string;
    avatar_url: string;
  }
}

export default function Login() {
  const [login, setLogin] = useState('');
  const router = useRouter()

  async function getInfomation() {
    try {
      const response: Profile = await axios.get(`https://api.github.com/users/${login}`);
      localStorage.setItem('@move-it/name', response.data.name);
      localStorage.setItem('@move-it/avatar_url', response.data.avatar_url);
      router.push('/');
    } catch(error) {
      alert('Usuário Inválido!');
    }
  }
  return (
      <div className={styles.container}>
        <section className={styles.logoSection}>
          <img src="/background.png" alt=""/>
        </section>

        <section className={styles.formSection}>
          <img src="/Logo.png" alt=""/>
          <strong>Bem-vindo</strong>
            <div className={styles.githubContainer}>
              <header>
                <img src="/icons/github.svg" alt=""/>
                <p>Faça login com seu github para começar</p>
              </header>
              <main>
                <input type="text" onChange={(e) => { setLogin(e.target.value)}} value={login} placeholder="Digite seu username"/>
                <button type="button" onClick={() => { getInfomation() }} disabled={login === '' ? true : false}>
                  <img src="/icons/arrow.svg" alt=""/>
                </button>
              </main>
            </div>
        </section>
      </div>
  )
}