require('dns').setDefaultResultOrder('ipv4first');

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');

const configurePassport = require('./config/passport');
const swaggerDocument = require('./swagger-output.json');
const mongodb = require('./data/database');

const app = express();
const port = process.env.PORT || 8080;
const isProduction = process.env.NODE_ENV === 'production';
const sessionSecret = process.env.SESSION_SECRET || 'development-session-secret';

app.set('trust proxy', 1);
app.locals.authEnabled = configurePassport();

app
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: isProduction,
        maxAge: 24 * 60 * 60 * 1000
      }
    })
  )
  .use(passport.initialize())
  .use(passport.session())
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
  });

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/', require('./routes'));

mongodb.initDb((err) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  } else {
    app.listen(port, () => {
      console.log(`Database connected and Server running on port ${port}`);
      console.log(`Swagger UI: http://localhost:${port}/api-docs`);
    });
  }
});
