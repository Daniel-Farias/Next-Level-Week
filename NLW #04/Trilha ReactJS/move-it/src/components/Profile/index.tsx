import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useContext, useEffect } from 'react';
import { ChallengesContext } from '../../contexts/ChallengesContext';
import styles from '../../styles/components/Profile.module.css';

export default function Profile () {
  const router = useRouter();
  const { level, deleteInfo } = useContext(ChallengesContext);
  const [ data, setData ] = useState({ name: null, avatar_url: null})

  useEffect(() => {
    const name = localStorage.getItem('@move-it/name');
    const avatar_url = localStorage.getItem('@move-it/avatar_url');

    setData({ name: name, avatar_url: avatar_url });
  }, []);

  async function logout() {
    deleteInfo();
    localStorage.removeItem('@move-it/name');
    localStorage.removeItem('@move-it/avatar_url');

    router.push('/login')
  }

  return (
    <div className={styles.profileContainer}>
      <img src={data.avatar_url} alt={data.name}/>
      <div>
        <strong>{data.name}</strong>
        <p>
          <img src="icons/level.svg" alt="Level"/>
          Level {level}
        </p>
      </div>

      <span onClick={() => {logout()}}>Sair</span>
    </div>    
  );
}