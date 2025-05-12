const express = require("express");
const cors = require("cors");
const sqlite3 = require('sqlite3').verbose();
const port = 8800;

const app = express();

var profileRouter = require("./routes/profile");

app.use(express.json());

// cors enables communication from front end to back end
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT'],
    credentials: true,
}));

const db = new sqlite3.Database('./databases/closet_circle_database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
    console.log('Connected to the SQLite database.');
})

app.use("/api/profile", profileRouter(db));

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

// For testing - route to get all posts
app.get('/api/posts-all', (req, res) => {
    const sqlSelectAll = `SELECT * FROM Post`;
    const queryImages = `SELECT image_url FROM Post_Image WHERE post_id = ?`;
    const queryUser = `SELECT first_name, last_name FROM User WHERE email = ?`;
    const queryPostCategories = `SELECT category_id FROM Post_Category WHERE post_id = ?`;

        db.all(sqlSelectAll, (err, posts) => {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: err.message });
                return;
            }

            // Fetch images and lister details for each post
            const postsWithDetails = posts.map((post) => {
                return new Promise((resolve, reject) => {
                    db.all(queryImages, [post.post_id], (err, images) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        post.images = images.map((img) => img.image_url);

                        db.all(queryPostCategories, [post.post_id], (err, categories) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            post.categories = categories.map((cat) => cat.category_id);

                        // Fetch lister details for the post
                        db.get(queryUser, [post.owner_id], (err, user) => {
                            if (err) {
                                reject(err);
                                return;
                            }

                            if (user) {
                                // construct lister object
                                post.lister = {
                                    display: `${user.first_name} ${user.last_name.charAt(0)}.`,
                                    username: post.owner_id,
                                    avatarUrl: null,    // Placeholder for avatar URL
                                };
                            } else {
                                // default lister object
                                post.lister = {
                                    display: 'Unknown',
                                    username: 'unknown-user',
                                    avatarUrl: null,
                                }
                            }
                            resolve(post);
                        })
                        })
                    });
                });
            });

            // After all images have been fetched for post
            Promise.all(postsWithDetails).then((results) => {
                res.json({ posts: results });
            }).catch((error) => {
                console.error(error.message);
                res.status(500).json({ error: error.message });
            });
        });
});

// For testing - route to get all from Post_Category (posts associated with categories) 
app.get('/api/post-cat', (req, res) => {
    const sqlSelectAll = `SELECT * FROM Post_Category`;
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
    db.run(sqlInsert, [first_name, last_name, username, password, email], function (err) {
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
    db.run(sqlInsert, [email, first_name, last_name, bio], function (err) {
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
    const { email } = req.query;
    console.log("email query " + email);
    const sqlSelect = `SELECT * FROM User WHERE email = ?`;
    db.all(sqlSelect, email, function (err, rows) {
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