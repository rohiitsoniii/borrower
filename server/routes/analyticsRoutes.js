import express from 'express';
const router = express.Router();
import { protect } from '../middleware/auth.js';
import {
  getTopUsers,
  getDailyBorrows
} from '../controllers/analyticsController.js';

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Analytics and reporting operations
 */

/**
 * @swagger
 * /analytics/top-users:
 *   get:
 *     summary: Get top 3 users with highest number of borrowed books
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Top users list
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/top-users', protect, getTopUsers);

/**
 * @swagger
 * /analytics/daily-borrows:
 *   get:
 *     summary: Get daily borrow counts for the past 7 days
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daily borrow counts
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/daily-borrows', protect, getDailyBorrows);

export default router;