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
const TOTAL_TIME = 3 * 60 * 60; // 3 hours in seconds
const TIMER_KEY = 'ctf_timer_state';
const TIMER_START_KEY = 'ctf_timer_start';
const USER_SCORE_KEY = 'ctf_user_score';
const ALL_SCORES_KEY = 'ctf_all_scores';

interface TimerState {
  isActive: boolean;
  remainingTime: number;
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
    description: "Like Elliot’s old-school tools, this cipher’s from the past. It operates in fixed cycles, shifting predictably through its sequence. A decade(10 years) ago, it might have been secure, but only the right key will reveal the truth.",
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
  {
    id: 9,
    title: "Crypto",
    description: "The Frostbitten Cipher The world’s top security agencies are in chaos. A rogue whistleblower, codenamed 'FrostByte,' has leaked classified intelligence hidden within a seemingly ordinary block of text. Encrypted messages disguised as innocent-looking snow-themed poetry are circulating on underground forums, but no one has been able to crack them—until now. You, an elite cyber-investigator, have intercepted one such message, but the encryption method is unlike anything you've seen before. Some words seem oddly spaced, as if the gaps between them hold a deeper meaning. A cryptic note left behind hints at an old-school technique—one that buries secrets in the whitespace itself. Your mission is to recover the hidden intelligence before rival hackers or government agencies do. Can you uncover FrostByte’s buried truth in the snow?",
    points: 50,
    link: "ctf/chall1ctf.zip",
    timeLimit: 90,
    flag: challengeFlags.crypto
  },
  {
    id: 10,
    title: "WEB FORENSICS",
    description: "A simple website holds a secret message. Can you find the hidden flag?",
    points: 50,
    link: "https://learnbydoing.vercel.app/",
    timeLimit: 90,
    flag: challengeFlags.web
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
  const [flag, setFlag] = useState('');
  
  // Initialize timer state with proper persistence
  const [timerState, setTimerState] = useState<TimerState>(() => {
    const savedState = localStorage.getItem(TIMER_KEY);
    if (savedState) {
      const parsed = JSON.parse(savedState);
      const startTime = localStorage.getItem(TIMER_START_KEY);
      if (startTime && parsed.isActive) {
        const elapsedSeconds = Math.floor((Date.now() - parseInt(startTime)) / 1000);
        const remainingTime = Math.max(TOTAL_TIME - elapsedSeconds, 0);
        return {
          isActive: remainingTime > 0,
          remainingTime: remainingTime
        };
      }
      return parsed;
    }
    return {
      isActive: false,
      remainingTime: TOTAL_TIME
    };
  });

  // Initialize scores with localStorage data
  const [scores, setScores] = useState<UserScore[]>(() => {
    const savedScores = localStorage.getItem(ALL_SCORES_KEY);
    return savedScores ? JSON.parse(savedScores) : [
      { username: "player1", points: 150, solvedChallenges: [1] },
      { username: "player2", points: 300, solvedChallenges: [1, 2] },
    ];
  });

  // Initialize current user score with localStorage data
  const [currentUser, setCurrentUser] = useState<UserScore>(() => {
    const savedUserScore = localStorage.getItem(USER_SCORE_KEY);
    if (savedUserScore) {
      return JSON.parse(savedUserScore);
    }
    return {
      username: user?.username || user?.firstName || user?.emailAddresses[0].emailAddress || "Anonymous",
      points: 0,
      solvedChallenges: []
    };
  });

  const { updateUserScore } = useLeaderboard();

  // Update currentUser when user data changes
  useEffect(() => {
    if (user) {
      const username = user.username || user.firstName || user.emailAddresses[0].emailAddress || "Anonymous";
      setCurrentUser(prev => ({
        ...prev,
        username: username
      }));
    }
  }, [user]);

  // Persist timer state
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerState.isActive && timerState.remainingTime > 0) {
      timer = setInterval(() => {
        setTimerState(prev => {
          const newState = {
            ...prev,
            remainingTime: prev.remainingTime - 1,
            isActive: prev.remainingTime - 1 > 0
          };
          localStorage.setItem(TIMER_KEY, JSON.stringify(newState));
          return newState;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerState.isActive]);

  // Persist scores whenever they change
  useEffect(() => {
    localStorage.setItem(ALL_SCORES_KEY, JSON.stringify(scores));
  }, [scores]);

  // Persist current user score whenever it changes
  useEffect(() => {
    localStorage.setItem(USER_SCORE_KEY, JSON.stringify(currentUser));
  }, [currentUser]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    if (!timerState.isActive) {
      const newState = {
        isActive: true,
        remainingTime: TOTAL_TIME
      };
      setTimerState(newState);
      localStorage.setItem(TIMER_KEY, JSON.stringify(newState));
      localStorage.setItem(TIMER_START_KEY, Date.now().toString());
    }
    setFlag('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (timerState.remainingTime <= 0) {
      alert('Time is up! You can no longer submit flags.');
      return;
    }
    
    if (selectedChallenge && flag === selectedChallenge.flag) {
      if (!currentUser.solvedChallenges.includes(selectedChallenge.id)) {
        const updatedUser = {
          ...currentUser,
          points: currentUser.points + selectedChallenge.points,
          solvedChallenges: [...currentUser.solvedChallenges, selectedChallenge.id]
        };
        setCurrentUser(updatedUser);
        updateUserScore(updatedUser.username, updatedUser.points, updatedUser.solvedChallenges);
        
        setScores(prev => {
          const filtered = prev.filter(s => s.username !== currentUser.username);
          return [...filtered, updatedUser].sort((a, b) => b.points - a.points);
        });
      }
      alert('Congratulations! Challenge completed successfully!');
      setSelectedChallenge(null);
      setFlag('');
    } else {
      alert('Incorrect flag. Try again!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-cyber-black">CTF Challenges</h1>
        <div className="text-xl font-semibold text-cyber-red">
          {timerState.isActive ? (
            timerState.remainingTime > 0 ? (
              `Time Remaining: ${formatTime(timerState.remainingTime)}`
            ) : (
              'Time is up!'
            )
          ) : (
            'Timer will start with first challenge'
          )}
        </div>
      </div>

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
                  disabled={timerState.remainingTime <= 0}
                  className={`${
                    timerState.remainingTime <= 0 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-cyber-red hover:bg-red-700'
                  } text-white px-4 py-2 rounded transition-colors`}
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
                        placeholder="CSCTF{flag_here}"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyber-blue focus:ring-cyber-blue"
                        disabled={timerState.remainingTime <= 0}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={timerState.remainingTime <= 0}
                      className={`w-full ${
                        timerState.remainingTime <= 0 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-cyber-red hover:bg-red-700'
                      } text-white px-4 py-2 rounded transition-colors`}
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
