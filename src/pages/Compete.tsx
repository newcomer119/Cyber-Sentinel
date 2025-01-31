import { useState, useEffect } from 'react';
import { challengeFlags } from '../data/challengeFlags';
import ScoreCard from '../components/ScoreCard';
import { useUser } from "@clerk/clerk-react";
import { useLeaderboard } from '../context/LeaderboardContext';

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
    title: "File Recovery Challenge",
    description: "We've received a file from an unknown source that was supposed to depict an alien vessel that would've been used for a possible invasion. However, the file matches no known file type and the data doesn't make sense either, leading us to believe it has been corrupted, possibly intentionally. See if you can manage to repair the corruption that has occurred and restore the file's contents, which would give us the upper hand in knowing what to expect in an invasion.",
    points: 50,
    link: "/ctf/firstctf.unknown",
    timeLimit: 30,
    flag: challengeFlags.forensics
  },
  {
    id: 2,
    title: "Steganography Challenge",
    description: "In the heart of the festive season, a cryptic invitation arrived for the annual Christmas party, featuring a seemingly ordinary picture concealing a hidden file. As guests gathered, excitement grew, turning the party into a digital treasure hunt with laptops and decoding tools, until one savvy guest uncovered the secret—a virtual advent calendar filled with personalized messages, festive images, and holiday cheer, celebrating both the victory in the steganography challenge and the magic of Christmas.",
    points: 150,
    link: "/ctf/helloctf2.jpg",
    timeLimit: 45,
    flag: challengeFlags.forensics2
  },
  {
    id: 3,
    title: "Classic Cipher Decryption Challenge",
    description: "Like Elliot’s old-school tools, this cipher’s from the past. It uses a fixed key and works in small, predictable chunks. It once ruled cryptography, but only the right key will reveal the truth.",
    points: 100,
    link: "/ctf/ctf7.jpg",
    timeLimit: 60,
    flag: challengeFlags.forensics3
  },
  {
    id: 4,
    title: "Audio Forensics Challenge",
    description: "Reverse engineer the application to find the flag hidden within the audio file.",
    points: 250,
    link: "/ctf/morse-CSCTF_ITS_THE_KING_OF_JACK-20wpm-600hzctf5.wav",
    timeLimit: 90,
    flag: challengeFlags.audio
  },
  {
    id: 5,
    title: "Metadata Analysis Challenge",
    description: "In the world of deception, they leave no trace—unless you know where to look. Everything has a signature, even the most innocuous things, and sometimes the answer is hidden where they think you won’t check. It’s not in the picture you see, but in the story behind it, where beneath the surface lies a record—the hidden truth often ignored. Seek beyond the visible, and only then will the key be revealed.",
    points: 250,
    link: "ctf/hack_mectf8.jpg",
    timeLimit: 90,
    flag: challengeFlags.forensics4
  },
  {
    id: 6,
    title: "Pattern Recognition Challenge",
    description: "A message flashes across your screen, almost lost in the noise: to uncover the truth, you must stop looking for the obvious. It’s not hidden in grand gestures but in the minutiae—small, almost imperceptible details the system hopes you’ll overlook, arranged with purpose, each piece fitting together not as you see it. Focus on the fine lines, the delicate contrasts, and what seems to be part of the background—only then will the picture become clear.",
    points: 250,
    link: "ctf/hack_mectf9.png",
    timeLimit: 90,
    flag: challengeFlags.forensics5
  },
  {
    id: 7,
    title: "Image Cryptanalysis Challenge",
    description: "You receive an anonymous message with the subject line: 'The system has been compromised.' The cryptic message reads: 'The revolution is coming. To decode the truth, you'll need to decrypt the whispers left behind by those who seek to expose the system's lies. The key is hidden in plain sight, disguised as part of an image—an image that once held the truth, now guarded by cryptic symbols. But be warned, the path forward is not clear, and only the bravest will decipher its secrets.'",
    points: 250,
    link: "ctf/hack_mectf10.jpg",
    timeLimit: 90,
    flag: challengeFlags.forensics6
  },
  {
    id: 8,
    title: "Unknown File Format Challenge",
    description: "A compressed archive contains an unknown file type. Can you determine its format and extract the flag?",
    points: 250,
    link: "ctf/ctf6.zip",
    timeLimit: 90,
    flag: challengeFlags.forensics7
  },
];


interface UserScore {
  username: string;
  points: number;
  solvedChallenges: number[];
}

export default function Compete() {
  const { user } = useUser();
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
    username: user?.username || user?.firstName || user?.emailAddresses[0].emailAddress || "Anonymous",
    points: 0,
    solvedChallenges: []
  });

  const { updateUserScore } = useLeaderboard();

  useEffect(() => {
    if (user) {
      setCurrentUser(prev => ({
        ...prev,
        username: user.username || user.firstName || user.emailAddresses[0].emailAddress || "Anonymous"
      }));
    }
  }, [user]);

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
        updateUserScore(updatedUser.username, updatedUser.points, updatedUser.solvedChallenges);
        
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
      <h1 className="text-3xl font-bold text-cyber-black mb-6">CTF Challenges </h1>

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
                        placeholder="cybersentinel{flag_here}"
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