import { useContext } from 'react';
import { ChallengesContext } from '../../contexts/ChallengesContext';
import { CountdownContext } from '../../contexts/CountdownContext';

import styles from '../../styles/components/ChallengeBox.module.css';

const ChallengeBox: React.FC = () => {
  const { activeChallenge, resetChallenge, completeChallenge } = useContext(ChallengesContext);
  const { resetCountdown } = useContext(CountdownContext);

  function handleChallengeSuccess() {
    completeChallenge();
    resetCountdown();
  }

  function handleChallengeFailed() {
    resetChallenge();
    resetCountdown();
  }

  return (
    <div className={styles.challengeBoxContainer}>
      {activeChallenge ? (
        <div className={styles.challengeActive}>
          <div className={styles.content}>
            <header>{`Ganhe ${activeChallenge.amount} xp`}</header>
            <main>
              <img src={`icons/${activeChallenge.type}.svg`} alt="Challenge"/>
              <strong>Novo desafio</strong>
              <p>{activeChallenge.description}</p>
            </main>
          </div>

          <footer>
            <button type="button" className={styles.challengeFailedButton} onClick={handleChallengeFailed}>Falhei</button>
            <button type="button" className={styles.challengeCompletedButton} onClick={handleChallengeSuccess}>Completei</button>
          </footer>
        </div>
      ): (
        <div className={styles.challengeNotActive}>
        <strong>Inicie um ciclo para receber desafios a serem completados</strong>
        <p>
          <img src="icons/level-up.svg" alt="Level Up"/>
          Avance de level completando desafios
        </p>
      </div>
      )}
    </div>
  );
}

export default ChallengeBox;