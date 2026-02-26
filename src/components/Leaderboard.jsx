import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const savedLeaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    setLeaderboard(savedLeaderboard);
  }, []);

  if (leaderboard.length === 0) {
    return null;
  }

  return (
    <div className="leaderboard">
      <h3>🏆 Leaderboard 🏆</h3>
      <ul className="leaderboard-list">
        {leaderboard.map((entry, index) => (
          <li key={index} className="leaderboard-item">
            <span className="name">{index + 1}. {entry.name}</span>
            <span className="score">{entry.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
