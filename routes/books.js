const express = require('express');
const router = express.Router();
const booksController = require('../controllers/books');
const { ensureAuthenticated } = require('../middleware/authenticate');

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: List of all books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Book'
 *       500:
 *         description: Internal server error
 */
router.get('/', booksController.getAll);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *         description: Book MongoDB ID
 *     responses:
 *       200:
 *         description: Book data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Book'
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', booksController.getSingle);

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/BookInput'
 *     responses:
 *       201:
 *         description: Book created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 */
router.post('/', ensureAuthenticated, booksController.create);

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *         description: Book MongoDB ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/BookInput'
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       400:
 *         description: Validation error or invalid ID
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', ensureAuthenticated, booksController.update);

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *         description: Book MongoDB ID
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       400:
 *         description: Invalid ID format
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', ensureAuthenticated, booksController.remove);

module.exports = router;
