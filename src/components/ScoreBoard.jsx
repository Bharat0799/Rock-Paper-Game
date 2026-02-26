import React from 'react';

const ScoreBoard = ({ scores, player, winner, gameMode, round, winningScore }) => {
  return (
    <header className="header">
      <div>
        <h1 className="game-title">Rock Paper Scissors</h1>
        <p className="score-subtitle">
          {gameMode === 'classic' ? 'Classic mode' : 'RPSLS mode'} • Round {round} • First to {winningScore}
        </p>
      </div>
      <div className="scoreboard">
        <div className={`score player ${winner === 'player' ? 'winner-glow' : ''}`}>
          <p className="score-label">{player}</p>
          <p className="score-value">{scores.player}</p>
        </div>
        <div className={`score computer ${winner === 'computer' ? 'winner-glow' : ''}`}>
          <p className="score-label">Computer</p>
          <p className="score-value">{scores.computer}</p>
        </div>
      </div>
    </header>
  );
};

export default ScoreBoard;
