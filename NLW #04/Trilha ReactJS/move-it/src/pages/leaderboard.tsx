import { GetServerSideProps } from 'next';

import users from '../../users.json';
import styles from '../styles/pages/Leaderboard.module.css';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';

export default function Leaderboard() {
  const [usersSorted, setUsersSorted] = useState([]);

  useEffect(() => {
    async function sortedUsers(data) {
      data.sort(function (a, b) {
        return b.xp - a.xp;
      });

      setUsersSorted(data);
    }

    sortedUsers(users);
  }, []);
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <Head>
          <title>Leaderboard | move.it</title>
        </Head>
        <strong>Leaderboard</strong>
        <div className={styles.table}>
          <header>
            <div>
              <span>POSIÇÃO</span>
              <span>USUÁRIO</span>
            </div>
              <div>
                <span>DESAFIOS</span>
                <span>EXPERIÊNCIA</span>
              </div>
          </header>
          {usersSorted.map((user, index) => (
            <div className={styles.content}>
              <div className={styles.position}>
                <span>{index + 1}</span>
              </div>
                
              <div>
                <div className={styles.user}>
                  <img src="https://robohash.org/f02c7b2ccba2a37ecbf317e0966bbbac?set=set1&bgset=&size=400x400" alt={user.name}/>
                  <div>
                    <strong>{user.name}</strong>
                      <p>
                        <img src="icons/level.svg" alt="Level"/>
                          Level {user.level}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={styles.infos}>
                  <div className={styles.desafios}>
                    <p>{user.desafios}</p> 
                    <span>Completados</span>
                  </div>
                  
                  <div className={styles.experiencia}>
                    <p>{user.xp}</p>
                    <span>XP</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {

  const { level, currentExperience, challengesCompleted} = ctx.req.cookies;
  return {
    props: {
      level: Number(level),
      currentExperience: Number(currentExperience),
      challengesCompleted: Number(challengesCompleted)
    }
  }
}
