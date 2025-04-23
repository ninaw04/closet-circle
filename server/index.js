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

// const db = new sqlite3.Database('./databases/test.db', sqlite3.OPEN_READWRITE, (err) => {
//     if (err) return console.error(err.message);
//     console.log('Connected to the SQLite database.');
// })

const db = new sqlite3.Database('./databases/closet_circle_database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
    console.log('Connected to the SQLite database.');
})

// FOR TESTING PURPOSES
// const sqlCreateTable = `CREATE TABLE IF NOT EXISTS users(
//     id INTEGER PRIMARY KEY,
//     first_name TEXT,
//     last_name TEXT,
//     username TEXT,
//     password TEXT,
//     email TEXT
// )`;

// db.run(sqlCreateTable, (err) => {
//     if (err) {
//         return console.error(err.message);
//     }
//     console.log('Users table created or already exists.');
// });


// Default endpoint
app.get('/', (req, res) => {
    res.json("hello this is the backend")
})

// Define a route to get all users
app.get('/api/users', (req, res) => {
    const sqlSelectAll = `SELECT * FROM User`;
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


// Route to add a user into table User of closet_circle_database
// note: used in client/app/users/new/page.tsx
app.post('/api/users/new', (req, res) => {
    console.log(req.body);
    const { email, first_name, last_name, bio } = req.body;
    const sqlInsert = `INSERT INTO User (email, first_name, last_name, bio) VALUES (?, ?, ?, ?)`;
    db.run(sqlInsert, [email, first_name, last_name, bio], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID }); 
    });
});

// Route to get a specific user based on email
// note: used in client/app/profile/page.tsx to display first & last name, bio
app.get('/api/profile', (req, res) => {
    //console.log(req.body);
    const {email} = req.query;
    console.log("email query " + email);
    const sqlSelect =  `SELECT * FROM User WHERE email = ?`;
    db.all(sqlSelect, email, function(err, rows) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        console.log("running query");
        console.log("rows: " + rows);
        res.json({ users: rows }); 
    });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})