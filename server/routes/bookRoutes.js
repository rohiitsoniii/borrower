import express from 'express';
const router = express.Router();
import { protect, admin } from '../middleware/auth.js';
import {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook,
  getUserBorrowedBooks,
  getBooksWithAvailability
} from '../controllers/bookController.js';

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management operations
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books with availability status
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all books with availability status
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', protect, getBooksWithAvailability);

/**
 * @swagger
 * /books/admin:
 *   post:
 *     summary: Create a new book (admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               author:
 *                 type: string
 *               price:
 *                 type: number
 *               totalCopies:
 *                 type: number
 *     responses:
 *       201:
 *         description: Book created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/admin', protect, admin, createBook);

/**
 * @swagger
 * /books/admin/{id}:
 *   put:
 *     summary: Update a book (admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               author:
 *                 type: string
 *               price:
 *                 type: number
 *               totalCopies:
 *                 type: number
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.put('/admin/:id', protect, admin, updateBook);

/**
 * @swagger
 * /books/admin/{id}:
 *   delete:
 *     summary: Delete a book (admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.delete('/admin/:id', protect, admin, deleteBook);

/**
 * @swagger
 * /books/borrow:
 *   post:
 *     summary: Borrow a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Book borrowed successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.post('/borrow', protect, borrowBook);

/**
 * @swagger
 * /books/return:
 *   post:
 *     summary: Return a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Book returned successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.post('/return', protect, returnBook);

/**
 * @swagger
 * /books/borrowed:
 *   get:
 *     summary: Get borrowed books for the current user
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of borrowed books
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/borrowed', protect, getUserBorrowedBooks);

export default router;