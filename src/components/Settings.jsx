import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const backdrop = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modal = {
  hidden: { y: "-100vh", opacity: 0 },
  visible: { 
    y: "0", 
    opacity: 1,
    transition: { delay: 0.2 }
  },
};

const Settings = ({ show, handleClose, gameMode, setGameMode }) => {
  return (
    <AnimatePresence mode='wait'>
      {show && (
        <motion.div 
          className="settings-backdrop"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={handleClose}
        >
          <motion.div 
            className="settings-modal glass-card"
            variants={modal}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <h2>Settings</h2>
            <div className="setting-option">
              <label>Game Mode</label>
              <div className="game-mode-toggle">
                <button 
                  className={gameMode === 'classic' ? 'active' : ''}
                  onClick={() => setGameMode('classic')}
                >
                  Classic
                </button>
                <button 
                  className={gameMode === 'rpsls' ? 'active' : ''}
                  onClick={() => setGameMode('rpsls')}
                >
                  RPSLS
                </button>
              </div>
            </div>
            <button className="game-btn" onClick={handleClose}>Close</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Settings;
