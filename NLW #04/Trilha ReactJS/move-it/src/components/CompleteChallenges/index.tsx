import { useContext } from 'react';
import { ChallengesContext } from '../../contexts/ChallengesContext';
import styles from '../../styles/components/CompleteChallenges.module.css';

const CompleteChallenges: React.FC = () => {
  const { challengesCompleted } = useContext(ChallengesContext);
  return (
    <div className={styles.completeChallengesContainer}>
      <span>Desafios Completos</span>
      <span>{challengesCompleted}</span>
    </div>
  );
}

export default CompleteChallenges;