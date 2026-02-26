import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ScoreBoard from './ScoreBoard';
import Controls from './Controls';

const ICONS = {
  rock: '\u270A',
  paper: '\u270B',
  scissors: '\u270C\uFE0F',
  lizard: '\uD83E\uDD8E',
  spock: '\uD83D\uDD96',
};

const LABELS = {
  rock: 'Rock',
  paper: 'Paper',
  scissors: 'Scissors',
  lizard: 'Lizard',
  spock: 'Spock',
};

const RULES = {
  classic: {
    choices: ['rock', 'paper', 'scissors'],
    winConditions: {
      rock: ['scissors'],
      paper: ['rock'],
      scissors: ['paper'],
    },
  },
  rpsls: {
    choices: ['rock', 'paper', 'scissors', 'lizard', 'spock'],
    winConditions: {
      rock: ['scissors', 'lizard'],
      paper: ['rock', 'spock'],
      scissors: ['paper', 'lizard'],
      lizard: ['spock', 'paper'],
      spock: ['scissors', 'rock'],
    },
  },
};

const WINNING_SCORE = 5;

const winSound = new Audio('/audio/win.mp3');
const loseSound = new Audio('/audio/lose.mp3');
const tieSound = new Audio('/audio/tie.mp3');

const pageVariants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  in: { opacity: 1, scale: 1, y: 0 },
  out: { opacity: 0, scale: 0.95, y: -20 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.45,
};

const Game = ({ player, onGameEnd, gameMode = 'classic' }) => {
  const { choices, winConditions } = RULES[gameMode];

  const [scores, setScores] = useState({ player: 0, computer: 0 });
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState('Pick a weapon to start the round');
  const [winner, setWinner] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [roundHistory, setRoundHistory] = useState([]);

  const roundNumber = roundHistory.length + 1;

  useEffect(() => {
    if (scores.player === WINNING_SCORE || scores.computer === WINNING_SCORE) {
      const timer = setTimeout(() => onGameEnd(scores.player), 1500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [scores, onGameEnd]);

  const handlePlayerChoice = (choiceKey) => {
    if (isProcessing) return;

    setIsProcessing(true);
    setPlayerChoice(choiceKey);
    setComputerChoice(null);
    setResult('Computer is deciding...');
    setWinner(null);

    setTimeout(() => {
      const compChoice = choices[Math.floor(Math.random() * choices.length)];
      setComputerChoice(compChoice);
      determineWinner(choiceKey, compChoice);
    }, 650);
  };

  const determineWinner = (pChoice, cChoice) => {
    let currentWinner = null;
    let roundText = '';

    if (pChoice === cChoice) {
      roundText = 'Draw round';
      tieSound.play().catch(() => {});
    } else if (winConditions[pChoice].includes(cChoice)) {
      roundText = 'You win round';
      setScores((prev) => ({ ...prev, player: prev.player + 1 }));
      currentWinner = 'player';
      winSound.play().catch(() => {});
    } else {
      roundText = 'Computer wins round';
      setScores((prev) => ({ ...prev, computer: prev.computer + 1 }));
      currentWinner = 'computer';
      loseSound.play().catch(() => {});
    }

    setResult(roundText);
    setRoundHistory((prev) => [
      {
        round: prev.length + 1,
        player: pChoice,
        computer: cChoice,
        winner: currentWinner || 'draw',
      },
      ...prev,
    ].slice(0, 6));

    setTimeout(() => {
      setWinner(currentWinner);
      setIsProcessing(false);
    }, 260);
  };

  const resultClass = useMemo(() => {
    if (winner === 'player') return 'win';
    if (winner === 'computer') return 'lose';
    if (result.toLowerCase().includes('draw')) return 'draw';
    return '';
  }, [result, winner]);

  const playerProgress = (scores.player / WINNING_SCORE) * 100;
  const computerProgress = (scores.computer / WINNING_SCORE) * 100;

  return (
    <motion.div
      className="game-area glass-card"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <ScoreBoard
        scores={scores}
        player={player}
        winner={winner}
        gameMode={gameMode}
        round={roundNumber}
        winningScore={WINNING_SCORE}
      />

      <section className="match-progress">
        <div className="progress-row">
          <span>{player}</span>
          <div className="progress-track">
            <motion.div className="progress-fill player" animate={{ width: `${playerProgress}%` }} />
          </div>
        </div>
        <div className="progress-row">
          <span>Computer</span>
          <div className="progress-track">
            <motion.div className="progress-fill computer" animate={{ width: `${computerProgress}%` }} />
          </div>
        </div>
      </section>

      <div className="choices">
        <div className="choice-card">
          <h3>{player}</h3>
          <motion.div
            className="choice-btn reveal"
            animate={{ scale: winner === 'player' ? [1, 1.15, 1] : 1 }}
            transition={{ duration: 0.25 }}
          >
            {playerChoice ? ICONS[playerChoice] : '?'}
          </motion.div>
          <p>{playerChoice ? LABELS[playerChoice] : 'Waiting'}</p>
        </div>

        <div className="choice-card">
          <h3>Computer</h3>
          <motion.div
            className="choice-btn reveal"
            animate={{ scale: winner === 'computer' ? [1, 1.15, 1] : 1 }}
            transition={{ duration: 0.25 }}
          >
            {isProcessing ? '...' : computerChoice ? ICONS[computerChoice] : '?'}
          </motion.div>
          <p>{computerChoice ? LABELS[computerChoice] : isProcessing ? 'Thinking...' : 'Waiting'}</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.h2
          key={result}
          className={`result-text ${resultClass}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {result}
        </motion.h2>
      </AnimatePresence>

      <Controls onChoice={handlePlayerChoice} disabled={isProcessing} gameMode={gameMode} />

      <section className="round-history">
        <div className="history-head">
          <h4>Round Feed</h4>
          <span>Last {roundHistory.length} rounds</span>
        </div>
        {roundHistory.length === 0 ? (
          <p className="history-empty">No rounds yet</p>
        ) : (
          <ul className="history-list">
            {roundHistory.map((entry) => (
              <li key={`r-${entry.round}`} className={`history-item ${entry.winner}`}>
                <span>R{entry.round}</span>
                <span>{ICONS[entry.player]} vs {ICONS[entry.computer]}</span>
                <strong>{entry.winner === 'draw' ? 'Draw' : entry.winner === 'player' ? 'You' : 'CPU'}</strong>
              </li>
            ))}
          </ul>
        )}
      </section>
    </motion.div>
  );
};

export default Game;
