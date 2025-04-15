const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');

const app = express();

// Connect to database
connectToDb();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // ✅ Fixed here

// Routes
app.get('/', (req, res) => {
  res.send("hello world");
});

app.use('/users', userRoutes);
app.use('/captain', captainRoutes);

module.exports = app;
