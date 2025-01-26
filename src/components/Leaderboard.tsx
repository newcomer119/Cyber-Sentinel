import React from 'react';
import { useLeaderboard } from '../context/LeaderboardContext';

const Leaderboard: React.FC = () => {
  const { leaderboard } = useLeaderboard();

  console.log('Current leaderboard:', leaderboard);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-cyber-black mb-6">Global Leaderboard</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Username</th>
            <th className="py-2 px-4 border-b">Points</th>
            <th className="py-2 px-4 border-b">Challenges Solved</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user) => (
            <tr key={user.username}>
              <td className="py-2 px-4 border-b">{user.username}</td>
              <td className="py-2 px-4 border-b">{user.points}</td>
              <td className="py-2 px-4 border-b">{user.solvedChallenges.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;