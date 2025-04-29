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

    // POST post for a specific user - O.C.
    router.post("/upload-item", (req, res) => {
        var post_id;
        const { closet_id, owner_id, title, likes, item_picture, description, date_posted, item_condition, categoriesBox } = req.body;
        const query = `
        INSERT INTO Post (closet_id, owner_id, title, likes, item_picture, description, date_posted, item_condition) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
        const query_post_category = `INSERT INTO Post_Category (post_id, category_id) VALUES (?, ?)`;
        console.log(categoriesBox);

        db.run(
            query,
            [closet_id, owner_id, title, likes, item_picture, description, date_posted, item_condition],
            function (err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                post_id = this.lastID;

                // Associate post with each category that was selected - O.C.
                categoriesBox.forEach(category => {
                    // if category was checked, insert into Post_Category
                    if (category.checked) {
                        db.run(
                            query_post_category,
                            [post_id, category.db_val],
                            function (err) {
                                if (err) {
                                    res.status(500).json({ error: err.message });
                                    return;
                                }
                            }
                        )
                    }
                });

                res.json("item saved to db"); // return success
            })

    })


    return router;
}