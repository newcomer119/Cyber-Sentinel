import UserScore from '../models/UserScore.js';

// Fetch all user scores
export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await UserScore.find().sort({ points: -1 });
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard', error });
  }
};

// Add or update user score
export const addOrUpdateUserScore = async (req, res) => {
  const { username, points, solvedChallenges } = req.body;

  try {
    const userScore = await UserScore.findOneAndUpdate(
      { username },
      { points, solvedChallenges },
      { new: true, upsert: true } // Create if not exists
    );
    res.json(userScore);
  } catch (error) {
    console.error('Error updating user score:', error); // Log the error
    res.status(500).json({ message: 'Error updating user score', error });
  }
};