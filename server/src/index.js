const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const middleware = require('./middleware');

const app = express();

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
});

app.use(morgan('common'));
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
}));

app.get('/', (req, res) => {
  res.json({
    message: 'Hello Penta',
  });
});

app.use(middleware.notFount);
app.use(middleware.errorHandler);

const port = process.env.PORT || 1337;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
