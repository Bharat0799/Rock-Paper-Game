import React, { useState } from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    in: { opacity: 1, scale: 1, y: 0 },
    out: { opacity: 0, scale: 0.9, y: -20 },
};

const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
};

const PlayerInput = ({ onStart }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim());
    }
  };

  return (
    <motion.div 
        className="player-input-container glass-card"
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
    >
      <h2>Enter Your Name</h2>
      <form onSubmit={handleSubmit}>
        <motion.input
          type="text"
          className="player-input"
          placeholder="Player"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength="15"
          autoFocus
          whileFocus={{ scale: 1.05, boxShadow: '0 0 10px 2px var(--primary-glow)'}}
        />
        <motion.button 
            type="submit" 
            className="game-btn start-game-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        >
          Start Game
        </motion.button>
      </form>
    </motion.div>
  );
};

export default PlayerInput;
