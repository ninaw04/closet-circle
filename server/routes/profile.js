var express = require("express");
var router = express.Router();

module.exports = (db) => {
    // GETS posts for a specific user
    router.get("/posts", (req, res) => {
        console.log("getting posts");
        const { ownerID } = req.query;
        const query = `SELECT * FROM Post WHERE owner_id = ?`;

        db.all(query, [ownerID], (err, rows) => {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ posts: rows });
        });
    })

    // post_id: Integer, title: String, closet_id: Integer, owner_id: String, likes: Integer, item_picture: String, description: String, date_posted: Date, clothing_category: String, item_condition: String

    // POST post for a specific user
    router.post("/upload-post", (req, rers) => {
        const { closet_id, owner_id, title, item_picture, description, item_condition } = req.body;
        const query = `
            INSERT INTO posts (closet_id, owner_id, title, item_picture, description, item_condition) VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        db.run(
            query,
            [closet_id, owner_id, title, item_picture, description, item_condition],
            function (err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json({ id: this.lastID });
            }
        )
    })

    return router;
}