const express = require('express');
const router = express.Router();
const membersController = require('../controllers/members');
const { ensureAuthenticated } = require('../middleware/authenticate');

/**
 * @swagger
 * /members:
 *   get:
 *     summary: Get all members
 *     tags: [Members]
 *     responses:
 *       200:
 *         description: List of all members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Member'
 *       500:
 *         description: Internal server error
 */
router.get('/', membersController.getAll);

/**
 * @swagger
 * /members/{id}:
 *   get:
 *     summary: Get a member by ID
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *         description: Member MongoDB ID
 *     responses:
 *       200:
 *         description: Member data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Member'
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Member not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', membersController.getSingle);

/**
 * @swagger
 * /members:
 *   post:
 *     summary: Create a new member
 *     tags: [Members]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/MemberInput'
 *     responses:
 *       201:
 *         description: Member created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 */
router.post('/', ensureAuthenticated, membersController.create);

/**
 * @swagger
 * /members/{id}:
 *   put:
 *     summary: Update a member by ID
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *         description: Member MongoDB ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/MemberInput'
 *     responses:
 *       200:
 *         description: Member updated successfully
 *       400:
 *         description: Validation error or invalid ID
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Member not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', ensureAuthenticated, membersController.update);

/**
 * @swagger
 * /members/{id}:
 *   delete:
 *     summary: Delete a member by ID
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *         description: Member MongoDB ID
 *     responses:
 *       200:
 *         description: Member deleted successfully
 *       400:
 *         description: Invalid ID format
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Member not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', ensureAuthenticated, membersController.remove);

module.exports = router;
