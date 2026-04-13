const express = require('express');
const passport = require('passport');

const authController = require('../controllers/auth');
const { ensureAuthEnabled, ensureAuthenticated } = require('../middleware/authenticate');

const router = express.Router();

/**
 * @swagger
 * /auth/status:
 *   get:
 *     summary: Check current authentication status
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Current login status and active user information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/AuthStatus'
 */
router.get('/status', authController.status);

/**
 * @swagger
 * /auth/login:
 *   get:
 *     summary: Start GitHub OAuth login flow
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects the browser to GitHub for authentication
 *       503:
 *         description: OAuth is not configured on the server
 */
router.get('/login', ensureAuthEnabled, passport.authenticate('github', { scope: ['user:email'] }));

/**
 * @swagger
 * /auth/github/callback:
 *   get:
 *     summary: GitHub OAuth callback route
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to the authenticated profile endpoint after login
 *       401:
 *         description: GitHub authentication failed
 */
router.get(
  '/github/callback',
  ensureAuthEnabled,
  passport.authenticate('github', {
    failureRedirect: '/auth/login-failed',
    session: true
  }),
  authController.loginSuccess
);

/**
 * @swagger
 * /auth/login-failed:
 *   get:
 *     summary: OAuth login failure response
 *     tags: [Auth]
 *     responses:
 *       401:
 *         description: GitHub authentication failed
 */
router.get('/login-failed', authController.loginFailed);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get the currently authenticated user profile
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Authenticated user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/AuthUser'
 *       401:
 *         description: Authentication required
 */
router.get('/profile', ensureAuthenticated, authController.profile);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Log out the current user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       500:
 *         description: Failed to log out user
 */
router.get('/logout', authController.logout);

module.exports = router;
