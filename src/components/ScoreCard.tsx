interface UserScore {
    username: string;
    points: number;
    solvedChallenges: number[];
  }
  
  interface ScoreCardProps {
    currentUser: UserScore;
  }
  
  const ScoreCard = ({ currentUser }: ScoreCardProps) => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-l-4 border-cyber-blue">
        <h2 className="text-xl font-semibold text-cyber-black mb-4">Your Score</h2>
        <div className="flex justify-between items-center">
          <span className="text-lg">{currentUser.username}</span>
          <span className="text-cyber-blue font-bold">{currentUser.points} points</span>
        </div>
        <div className="text-sm text-gray-600 mt-2">
          Challenges completed: {currentUser.solvedChallenges.length}
        </div>
      </div>
    );
  };
  
  export default ScoreCard;