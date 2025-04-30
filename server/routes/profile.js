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
        const { closet_id, owner_id, title, likes, item_pictures, description, date_posted, item_condition, categories, size, for_sale, for_rent, price} = req.body;
        const query = `INSERT INTO Post (closet_id, owner_id, title, likes, description, date_posted, item_condition, size) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const query_post_category = `INSERT INTO Post_Category (post_id, category_id) VALUES (?, ?)`;
        const query_post_images = `INSERT INTO Post_Image (post_id, image_url) VALUES (?, ?)`;
        const query_borrow = `INSERT INTO Borrow (post_id, rental_start_date, rental_end_date) VALUES (?, ?, ?)`;
        const query_sell = `INSERT INTO Sell (post_id, price) VALUES (?, ?)`;
        console.log(categories);

        db.run(
            query,
            [closet_id, owner_id, title, likes, description, date_posted, item_condition, size],
            function (err) {
                if (err) {
                    console.log("error inserting inital post");
                    console.log([closet_id, owner_id, title, likes, description, date_posted, item_condition, size]);
                    res.status(500).json({ error: err.message });
                    return;
                }
                post_id = this.lastID;

                // Associate post with multiple images
                item_pictures.forEach(image_url => {
                    db.run(
                        query_post_images,
                        [post_id, image_url],
                        function (err) {
                            if (err) {
                                console.log("error inserting images");
                                res.status(500).json({ error: err.message });
                                return;
                            }
                        }
                    )
                });

                // Associate post with each category that was selected - O.C.
                // categories is an array of integers representing the category_id
                categories.forEach(category_id => {
                        db.run(
                            query_post_category,
                            [post_id, category_id],
                            function (err) {
                                if (err) {
                                    console.log("error inserting category");
                                    res.status(500).json({ error: err.message });
                                    return;
                                }
                            }
                        )
                });

                // Borrow post
                if (for_rent) {
                    db.run(
                        query_borrow,
                        [post_id, "2025-05-01", "2020-05-07"],
                        function (err) {
                            if (err) {
                                console.log("error inserting rent post");
                                res.status(500).json({ error: err.message });
                                return;
                            }
                        }
                    )
                }

                // Sell post
                if (for_sale) {
                    db.run(
                        query_sell,
                        [post_id, price],
                        function (err) {
                            if (err) {
                                console.log("error inserting sell post");
                                res.status(500).json({ error: err.message });
                                return;
                            }
                        }
                    )
                }

                console.log("size: " + size + ", for sale: " + for_sale + ", for rent: " + for_rent);

                res.json("item saved to db"); // return success
            })

    })


    return router;
}