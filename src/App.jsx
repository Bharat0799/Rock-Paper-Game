import React, { useEffect, Suspense, lazy, useState } from 'react';
import Confetti from 'react-confetti';
import { AnimatePresence, motion } from 'framer-motion';
import { FiSettings } from 'react-icons/fi';

const PlayerInput = lazy(() => import('./components/PlayerInput'));
const Game = lazy(() => import('./components/Game'));
const Leaderboard = lazy(() => import('./components/Leaderboard'));
const Settings = lazy(() => import('./components/Settings'));

const pageVariants = {
  initial: { opacity: 0, scale: 0.95, y: 24 },
  in: { opacity: 1, scale: 1, y: 0 },
  out: { opacity: 0, scale: 0.95, y: -24 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.45,
};

const App = () => {
  const [player, setPlayer] = useState('');
  const [gameState, setGameState] = useState('input');
  const [finalScore, setFinalScore] = useState(0);
  const [theme, setTheme] = useState('dark');
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [gameMode, setGameMode] = useState('classic');
  const [sessionGames, setSessionGames] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  const hasWindow = typeof window !== 'undefined';
  const width = hasWindow ? window.innerWidth : null;
  const height = hasWindow ? window.innerHeight : null;

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const savedGameMode = localStorage.getItem('gameMode') || 'classic';
    setTheme(savedTheme);
    setGameMode(savedGameMode);
    document.documentElement.setAttribute('data-theme', savedTheme);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('gameMode', gameMode);
  }, [gameMode]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const updateLeaderboard = (playerName, score) => {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ name: `${playerName} (${gameMode.slice(0, 1).toUpperCase()})`, score });
    leaderboard.sort((a, b) => b.score - a.score);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard.slice(0, 5)));
  };

  const handleGameStart = (playerName) => {
    setPlayer(playerName);
    setGameState('playing');
  };

  const handleGameEnd = (score) => {
    setFinalScore(score);
    setSessionGames((prev) => prev + 1);
    setBestScore((prev) => Math.max(prev, score));
    updateLeaderboard(player, score);
    setGameState('finished');
  };

  const handlePlayAgain = () => {
    setGameState('playing');
  };

  const getModeLabel = () => (gameMode === 'classic' ? 'Classic' : 'RPSLS');

  const renderGameState = () => {
    switch (gameState) {
      case 'input':
        return <PlayerInput key="player-input" onStart={handleGameStart} />;
      case 'playing':
        return <Game key="game" player={player} onGameEnd={handleGameEnd} gameMode={gameMode} />;
      case 'finished':
        return (
          <motion.div
            key="game-over"
            className="game-over-container glass-card"
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
          >
            {finalScore > 0 && width && height && (
              <Confetti width={width} height={height} recycle={false} numberOfPieces={350} tweenDuration={7000} />
            )}
            <p className="status-kicker">Session Complete</p>
            <h2 className="game-over-title">{player}, match finished.</h2>
            <p className="final-score">Final Score: {finalScore}</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="game-btn" onClick={handlePlayAgain}>
              Play Again
            </motion.button>
            <Leaderboard />
          </motion.div>
        );
      default:
        return <PlayerInput key="default-input" onStart={handleGameStart} />;
    }
  };

  if (loading) {
    return (
      <div className="loader-wrapper">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <>
      <div className="animated-bg"></div>

      <Suspense fallback={<div className="loader"></div>}>
        <Settings show={showSettings} handleClose={() => setShowSettings(false)} gameMode={gameMode} setGameMode={setGameMode} />
      </Suspense>

      <main className="app-container">
        <section className="top-panel glass-card">
          <div className="brand-block">
            <p className="status-kicker">Frontend Arena</p>
            <h1>Rock Paper Scissors</h1>
          </div>
          <div className="session-grid">
            <div className="session-chip">
              <span>Mode</span>
              <strong>{getModeLabel()}</strong>
            </div>
            <div className="session-chip">
              <span>Games</span>
              <strong>{sessionGames}</strong>
            </div>
            <div className="session-chip">
              <span>Best</span>
              <strong>{bestScore}</strong>
            </div>
          </div>
        </section>

        <section className="stage-area">
          <AnimatePresence mode="wait">
            <Suspense fallback={<div className="loader"></div>}>{renderGameState()}</Suspense>
          </AnimatePresence>
        </section>

        <footer className="footer glass-card">
          <div className="footer-buttons">
            <motion.button
              whileHover={{ scale: 1.08, rotate: 45 }}
              whileTap={{ scale: 0.95, rotate: 0 }}
              className="settings-btn"
              onClick={() => setShowSettings(true)}
              aria-label="Open settings"
            >
              <FiSettings />
            </motion.button>
          </div>
          <div className="theme-switch-wrapper">
            <span>{theme === 'light' ? 'Sun' : 'Moon'}</span>
            <label className="theme-switch">
              <input type="checkbox" onChange={toggleTheme} checked={theme === 'dark'} />
              <span className="slider round"></span>
            </label>
          </div>
        </footer>
      </main>
    </>
  );
};

export default App;
