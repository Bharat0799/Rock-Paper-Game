import React from 'react';
import { motion } from 'framer-motion';

const CHOICES = {
  classic: [
    { key: 'rock', icon: '\u270A', name: 'Rock' },
    { key: 'paper', icon: '\u270B', name: 'Paper' },
    { key: 'scissors', icon: '\u270C\uFE0F', name: 'Scissors' },
  ],
  rpsls: [
    { key: 'rock', icon: '\u270A', name: 'Rock' },
    { key: 'paper', icon: '\u270B', name: 'Paper' },
    { key: 'scissors', icon: '\u270C\uFE0F', name: 'Scissors' },
    { key: 'lizard', icon: '\uD83E\uDD8E', name: 'Lizard' },
    { key: 'spock', icon: '\uD83D\uDD96', name: 'Spock' },
  ],
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const buttonVariants = {
  hidden: { y: 12, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const Controls = ({ onChoice, disabled, gameMode = 'classic' }) => {
  const choices = CHOICES[gameMode];

  return (
    <div className="controls-container">
      <p>Choose your weapon</p>
      <motion.div className={`control-buttons ${gameMode}`} variants={containerVariants} initial="hidden" animate="visible">
        {choices.map((choice) => (
          <motion.button
            key={choice.key}
            className="choice-btn weapon-btn"
            onClick={() => onChoice(choice.key)}
            disabled={disabled}
            aria-label={choice.name}
            variants={buttonVariants}
            whileHover={{ scale: 1.06, transition: { type: 'spring', stiffness: 280 } }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="weapon-icon">{choice.icon}</span>
            <span className="weapon-label">{choice.name}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default Controls;
