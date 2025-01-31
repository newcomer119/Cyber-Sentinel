// src/routes/leaderboardRoutes.js
import express from 'express';
import { getLeaderboard, addOrUpdateUserScore } from '../controllers/leaderboardController.js';

const router = express.Router();

router.get('/', getLeaderboard);
router.post('/update', addOrUpdateUserScore);

export default router;