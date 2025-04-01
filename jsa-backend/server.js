const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors'); // To handle CORS

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors());  // Enable CORS for all origins

// Database setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'J3vanza04*', // Replace with your MySQL password
  database: 'jsa_database' // Database name
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Endpoint for eboard sign-up
app.post('/signup', (req, res) => {
  const { username, email, password, role } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  const query = 'INSERT INTO eboard_members (username, email, password_hash, role) VALUES (?, ?, ?, ?)';
  db.query(query, [username, email, hashedPassword, role], (err, result) => {
    if (err) {
      res.status(500).send('Error in registration');
    } else {
      res.json({ message: 'You are successfully signed up.' });
    }
  });
});

// Endpoint for eboard login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM eboard_members WHERE username = ?';
  db.query(query, [username], (err, result) => {
    if (err) throw err;

    if (result.length > 0 && bcrypt.compareSync(password, result[0].password_hash)) {
      // Create a JWT token
      const token = jwt.sign({ id: result[0].id, role: result[0].role }, 'secret_key', { expiresIn: '1h' });
      res.json({ message: 'Logged in successfully', token });
    } else {
      res.status(401).send({ message: 'Invalid credentials' });
    }
  });
});

// Endpoint to create/edit events (admin only)
app.post('/events', verifyToken, (req, res) => {
  const { event_name, event_date, event_location, event_description } = req.body;

  const query = 'INSERT INTO events (event_name, event_date, event_location, event_description) VALUES (?, ?, ?, ?)';
  db.query(query, [event_name, event_date, event_location, event_description], (err, result) => {
    if (err) {
      res.status(500).send('Error in creating event');
    } else {
      res.json({ message: 'Event created successfully' });
    }
  });
});

// Endpoint to view members (admin only)
app.get('/members', verifyToken, (req, res) => {
  const query = 'SELECT * FROM members';
  db.query(query, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// Middleware for verifying JWT token
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).send('Token required');
  }

  jwt.verify(token, 'secret_key', (err, decoded) => {
    if (err) {
      return res.status(403).send('Invalid token');
    }
    req.user = decoded;
    next();
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});