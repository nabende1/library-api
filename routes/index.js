const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Library API server running',
    authentication: {
      enabled: req.app.locals.authEnabled,
      login: 'GET /auth/login',
      status: 'GET /auth/status',
      profile: 'GET /auth/profile',
      logout: 'GET /auth/logout'
    },
    endpoints: {
      books: {
        getAll: 'GET /books',
        getOne: 'GET /books/:id',
        create: 'POST /books',
        update: 'PUT /books/:id',
        delete: 'DELETE /books/:id'
      },
      members: {
        getAll: 'GET /members',
        getOne: 'GET /members/:id',
        create: 'POST /members',
        update: 'PUT /members/:id',
        delete: 'DELETE /members/:id'
      }
    }
  });
});

router.use('/auth', require('./auth'));
router.use('/books', require('./books'));
router.use('/members', require('./members'));

module.exports = router;
