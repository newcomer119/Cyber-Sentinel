import React, { createContext, useContext, useState } from 'react';

interface UserScore {
  username: string;
  points: number;
  solvedChallenges: number[];
}

interface LeaderboardContextType {
  leaderboard: UserScore[];
  updateUserScore: (username: string, points: number, solvedChallenges: number[]) => void;
  addUser: (username: string) => void;
}

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(undefined);

export const LeaderboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leaderboard, setLeaderboard] = useState<UserScore[]>([]);

  const updateUserScore = (username: string, points: number, solvedChallenges: number[]) => {
    setLeaderboard((prev) => {
      const existingUser = prev.find(user => user.username === username);
      if (existingUser) {
        return prev.map(user =>
          user.username === username
            ? { ...user, points, solvedChallenges }
            : user
        );
      } else {
        return [...prev, { username, points, solvedChallenges }];
      }
    });
  };

  const addUser = (username: string) => {
    setLeaderboard((prev) => {
      if (!prev.find(user => user.username === username)) {
        return [...prev, { username, points: 0, solvedChallenges: [] }];
      }
      return prev;
    });
  };

  return (
    <LeaderboardContext.Provider value={{ leaderboard, updateUserScore, addUser }}>
      {children}
    </LeaderboardContext.Provider>
  );
};

export const useLeaderboard = () => {
  const context = useContext(LeaderboardContext);
  if (!context) {
    throw new Error('useLeaderboard must be used within a LeaderboardProvider');
  }
  return context;
};