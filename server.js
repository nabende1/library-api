require('dns').setDefaultResultOrder('ipv4first');

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('./swagger-output.json');
const mongodb = require('./data/database');

const app = express();
const port = process.env.PORT || 8080;

app
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
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
