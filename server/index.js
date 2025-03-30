;const express = require("express");
const cors = require("cors");
const sqlite3 = require('sqlite3').verbose();
const port = 8800;

const app = express();

app.use(express.json());

// cors enables communication from front end to back end
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  }));

const db = new sqlite3.Database('./databases/test.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
    console.log('Connected to the SQLite database.');
})

// FOR TESTING PURPOSES
const sqlCreateTable = `CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    username TEXT,
    password TEXT,
    email TEXT
)`;

db.run(sqlCreateTable, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Users table created or already exists.');
});


// Default endpoint
app.get('/', (req, res) => {
    res.json("hello this is the backend")
})

// Define a route to get all users
app.get('/api/users', (req, res) => {
    const sqlSelectAll = `SELECT * FROM users`;
    db.all(sqlSelectAll, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ users: rows });
    });
});

// Define a route to add a new user
app.post('/api/users', (req, res) => {
    const { first_name, last_name, username, password, email } = req.body;
    const sqlInsert = `INSERT INTO users (first_name, last_name, username, password, email) VALUES (?, ?, ?, ?, ?)`;
    db.run(sqlInsert, [first_name, last_name, username, password, email], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
});

// TESTING - adds a new user to the database from client side page /users/new
app.post('/api/users/new', (req, res) => {
    console.log(req.body);
    const { first_name, last_name, username, password, email } = req.body;
    const sqlInsert = `INSERT INTO users (first_name, last_name, username, password, email) VALUES (?, ?, ?, ?, ?)`;
    db.run(sqlInsert, [first_name, last_name, username, password, email], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID }); 
    });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})