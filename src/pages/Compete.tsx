import { useState, useEffect } from 'react';
import { challengeFlags } from '../data/challengeFlags';
import ScoreCard from '../components/ScoreCard';

interface Challenge {
  id: number;
  title: string;
  description: string;
  points: number;
  link: string;
  timeLimit: number; // in minutes
  flag: string;
}

const challenges: Challenge[] = [
  {
    id: 1,
    title: "Web Exploitation 101",
    description: "Find the hidden flag in the website's source code",
    points: 100,
    link: "https://challenge1.example.com",
    timeLimit: 30,
    flag: challengeFlags.web_exploitation
  },
  {
    id: 2,
    title: "Cryptography Challenge",
    description: "Decrypt the message to find the flag",
    points: 150,
    link: "https://challenge2.example.com",
    timeLimit: 45,
    flag: challengeFlags.cryptography
  },
  {
    id: 3,
    title: "Binary Exploitation",
    description: "Exploit the binary to get the flag",
    points: 200,
    link: "https://challenge3.example.com",
    timeLimit: 60,
    flag: challengeFlags.binary
  },
  {
    id: 4,
    title: "Forensics Investigation",
    description: "Analyze the packet capture to find the flag",
    points: 175,
    link: "https://challenge4.example.com",
    timeLimit: 45,
    flag: challengeFlags.forensics
  },
  {
    id: 5,
    title: "Reverse Engineering",
    description: "Reverse engineer the application to find the flag",
    points: 250,
    link: "https://challenge5.example.com",
    timeLimit: 90,
    flag: challengeFlags.reverse_engineering
  }
];

interface UserScore {
  username: string;
  points: number;
  solvedChallenges: number[];
}

export default function Compete() {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [flag, setFlag] = useState('');
  const [scores, setScores] = useState<UserScore[]>([
    { username: "player1", points: 150, solvedChallenges: [1] },
    { username: "player2", points: 300, solvedChallenges: [1, 2] },
    // Add more mock data as needed
  ]);
  
  // Mock current user - In real app, this would come from auth context
  const [currentUser, setCurrentUser] = useState<UserScore>({
    username: "currentPlayer",
    points: 0,
    solvedChallenges: []
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (selectedChallenge && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [selectedChallenge, timeLeft]);

  const startChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setTimeLeft(challenge.timeLimit * 60);
    setFlag('');
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedChallenge && flag === selectedChallenge.flag) {
      // Update current user's score
      if (!currentUser.solvedChallenges.includes(selectedChallenge.id)) {
        const updatedUser = {
          ...currentUser,
          points: currentUser.points + selectedChallenge.points,
          solvedChallenges: [...currentUser.solvedChallenges, selectedChallenge.id]
        };
        setCurrentUser(updatedUser);
        
        // Update scoreboard
        setScores(prev => {
          const filtered = prev.filter(s => s.username !== currentUser.username);
          return [...filtered, updatedUser].sort((a, b) => b.points - a.points);
        });
      }
      alert('Congratulations! Challenge completed successfully!');
      // Clear the current challenge and flag
      setSelectedChallenge(null);
      setFlag('');
      setTimeLeft(0);
    } else {
      alert('Incorrect flag. Try again!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-cyber-black mb-6">CTF Challenges</h1>

      <ScoreCard scores={scores} currentUser={currentUser} />

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-cyber-black">Available Challenges</h2>
          {challenges.map(challenge => (
            <div
              key={challenge.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-cyber-red"
            >
              <h3 className="text-lg font-semibold text-cyber-black mb-2">{challenge.title}</h3>
              <p className="text-gray-600 mb-3">{challenge.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-cyber-blue font-medium">{challenge.points} points</span>
                <button
                  onClick={() => startChallenge(challenge)}
                  className="bg-cyber-red text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  Start Challenge
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-cyber-blue">
          <h2 className="text-xl font-semibold text-cyber-black mb-4">Challenge Details</h2>
          {selectedChallenge ? (
            <div>
              <h3 className="text-lg font-semibold mb-2">{selectedChallenge.title}</h3>
              {currentUser.solvedChallenges.includes(selectedChallenge.id) ? (
                <div className="mb-4 text-green-600 font-medium">
                  ✓ You have already completed this challenge
                </div>
              ) : (
                <>
                  <p className="text-gray-600 mb-4">{selectedChallenge.description}</p>
                  <div className="mb-4">
                    <span className="font-medium">Time Remaining: </span>
                    <span className="text-cyber-red">{formatTime(timeLeft)}</span>
                  </div>
                  <div className="mb-4">
                    <a
                      href={selectedChallenge.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyber-blue hover:text-blue-700"
                    >
                      Open Challenge
                    </a>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="flag" className="block text-sm font-medium text-gray-700">
                        Submit Flag
                      </label>
                      <input
                        type="text"
                        id="flag"
                        value={flag}
                        onChange={(e) => setFlag(e.target.value)}
                        placeholder="CTF{flag_here}"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyber-blue focus:ring-cyber-blue"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-cyber-red text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                    >
                      Submit Flag
                    </button>
                  </form>
                </>
              )}
            </div>
          ) : (
            <p className="text-gray-600">Select a challenge to begin</p>
          )}
        </div>
      </div>
    </div>
  );
}