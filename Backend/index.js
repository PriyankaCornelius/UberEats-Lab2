const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// import pkg1 from 'bcryptjs';
// const { compare, genSalt, hash: _hash } = pkg1;
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

//Allow Access Control
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Cache-Control", "no-cache");
  next();
});

// const exercisesRouter = require('./routes/exercises');
// const usersRouter = require('./routes/users');
const customerRouter = require('./routes/customer');
const restaurantRouter = require('./routes/restaurant');
// app.use('/exercises', exercisesRouter);
// app.use('/users', usersRouter);
app.use('/customer', customerRouter);
app.use('/restaurant', restaurantRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});