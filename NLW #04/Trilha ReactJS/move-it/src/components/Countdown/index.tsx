import { useEffect, useState, useContext } from 'react';
import { CountdownContext } from '../../contexts/CountdownContext';
import styles from '../../styles/components/Countdown.module.css';

const Countdown: React.FC = () => {
  const { minutes, seconds, hasFinished, isActive, startCountdown, resetCountdown, getPercentageTime} = useContext(CountdownContext);
  
  const [minuteLeft, minuteRight] = String(minutes).padStart(2, "0").split('');
  const [secondLeft, secondRight] = String(seconds).padStart(2, "0").split('');

  return (
    <div>
      <div className={styles.countdownContainer}>
        <div>
          <span>{minuteLeft}</span>
          <span>{minuteRight}</span>
        </div>
        <span>:</span>
        <div>
          <span>{secondLeft}</span>
          <span>{secondRight}</span>
        </div>
      </div>

      {hasFinished ? (
        <button disabled className={styles.countdownButton}>
          Ciclo Encerrado
          <img src="icons/check.svg" alt="Finalizado"/>
        </button>
      ) : (
        <div className={styles.contentButton}>
          <button type="button"
            className={`${styles.countdownButton} ${isActive ? styles.countdownButtonActive : null}`}
            onClick={isActive ? resetCountdown : startCountdown}
          >
            {isActive ? 'Abandonar Ciclo' : 'Iniciar um Ciclo'}
          </button>
          {isActive && <div style={{ width: `${getPercentageTime()}%` }}></div>}
        </div>
      )}
    </div>
  );
}

export default Countdown;