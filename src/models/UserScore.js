// src/models/UserScore.js
import mongoose from 'mongoose';

const userScoreSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  points: { type: Number, default: 0 },
  solvedChallenges: { type: [Number], default: [] },
});

const UserScore = mongoose.model('UserScore', userScoreSchema);

export default UserScore;