var express = require("express");
// const cors = require("cors");
var router = express.Router();

module.exports = (db) => {
    // GETS posts for a specific user
    router.get("/posts", (req, res) => {
        console.log("getting posts");
        const { ownerID } = req.query;
        const queryPosts = `SELECT * FROM Post WHERE owner_id = ?`;
        const queryImages = `SELECT image_url FROM Post_Image WHERE post_id = ?`;

        db.all(queryPosts, [ownerID], (err, posts) => {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: err.message });
                return;
            }

            // Fetch images for each post
            const postsWithImages = posts.map((post) => {
                return new Promise((resolve, reject) => {
                    db.all(queryImages, [post.post_id], (err, images) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        post.images = images.map((img) => img.image_url);
                        resolve(post);
                    });
                });
            });

            // After all images have been fetched for post
            Promise.all(postsWithImages).then((results) => {
                res.json({ posts: results });
            }).catch((error) => {
                console.error(error.message);
                res.status(500).json({ error: error.message });
            });
        });
    })

    // GET friends list
    router.get("/friends", (req, res) => {
        const { email } = req.query;
        const queryFriends = `SELECT friend_id FROM Friend WHERE email = ?`;
        // TODO UPDATE WITH FRIEND PROFILE URL
        const queryFriendDetails = `SELECT first_name, last_name, email FROM User WHERE email = ?`;

        db.all(queryFriends, [email], (err, rows) => {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: err.messsage });
                return;
            }

            if (!rows || rows.length === 0) {
                res.json({ friends: [] });
                return;
            }

            const friendDetailsPromises = rows.map((row) => {
                return new Promise((resolve, reject) => {
                    db.get(queryFriendDetails, [row.friend_id], (err, friend) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(friend);
                    });
                });
            });

            Promise.all(friendDetailsPromises)
                .then((friends) => {
                    res.json({ friends });
                })
                .catch((error) => {
                    console.error(error.message);
                    res.status(500).json({ error: error.message });
                });
        })
    })

    // GET user's cart
    router.get("/cart", (req, res) => {
        const { email } = req.query;
        const queryTransaction = `SELECT transaction_id FROM Transactions WHERE email = ? AND status = 'pending'`;
        const queryCart = `SELECT post_id FROM Transaction_Listing WHERE transaction_id = ?`
        const queryPosts = `SELECT title, price FROM Post WHERE post_id = ?`
        const queryPostImage = `SELECT image_url FROM Post_Image WHERE post_id = ?`

        db.get(queryTransaction, [email], (err, transaction) => {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: err.message });
                return;
            }

            if (!transaction) {
                // no pending transaction found
                res.json({ cart: [] });
                return;
            }

            const transactionId = transaction.transaction_id;

            // Find all post IDs in the transaction
            db.all(queryCart, [transactionId], (err, cartItems) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).json({ error: err.message });
                    return;
                }

                if (!cartItems || cartItems.length === 0) {
                    // No items in the cart
                    res.json({ cart: [] });
                    return;
                }

                // Fetch details for each post in the cart
                const cartDetailsPromises = cartItems.map((item) => {
                    return new Promise((resolve, reject) => {
                        db.get(queryPosts, [item.post_id], (err, post) => {
                            if (err) {
                                reject(err);
                                return;
                            }

                            if (!post) {
                                resolve(null);
                                return;
                            }

                            // Fetch post images
                            db.all(queryPostImage, [item.post_id], (err, images) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }

                                post.images = images.map((img) => img.image_url);
                                resolve({ ...post, post_id: item.post_id });
                            });
                        });
                    });
                });

                // Resolve all promises and return thte cart details
                Promise.all(cartDetailsPromises)
                    .then((cartDetails) => {
                        // Filer out any null results
                        const filteredCartDetails = cartDetails.filter((item) => item !== null);
                        res.json({ transId: transactionId, cart: filteredCartDetails });
                    })
                    .catch((error) => {
                        console.error(error.message);
                        res.status(500).json({ error: error.message });
                    })
            })
        })
    })

    // update cart status
    router.put("/checkout", (req, res) => {
        const { transactionId } = req.query;
        const checkoutQuery = `
            UPDATE Transactions SET status = 'purchased'
            WHERE transaction_id = ? AND status = 'pending'`;
        
        db.run(checkoutQuery, [transactionId], function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: "Failed to checkout" });
                return;
            }

            res.json({ success: true, message: "Checkout completed" });
        })
    })

    router.put("/cart/addItem", (req, res) => {
        const { transactionId, postId } = req.body;
        const addItemQuery = `INSERT INTO Transaction_Listing (transaction_id, post_id) VALUES (?, ?)`;

        db.run(addItemQuery, [transactionId, postId], function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: "Failed to add item to cart" });
                return;
            }

            res.json({ success: true, message: "Item added to cart" });
        })
    })

    // get transaction id
    router.get("/cart/id", (req, res) => {
        const { email } = req.query;
        const query = `SELECT transaction_id FROM Transactions WHERE email = ? AND status = 'pending'`;

        db.get(query, [email], (err, row) => {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: "Failed to retrieve transaction ID" });
                return;
            }

            if (!row) {
                // no pending transaction found
                res.json({ transactionId: null, message: "No pending transaction found" });
                return;
            }

            res.json({ transactionId: row.transaction_id });
        })
    })

    // PUT updates existing data
    // DELETE cart item
    router.delete("/cart/item", (req, res) => {
        const { transactionId, postId } = req.body;
        const deleteQuery = `DELETE FROM Transaction_Listing WHERE transaction_id = ? AND post_id = ?`;

        db.run(deleteQuery, [transactionId, postId], function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: "Failed to remove item from cart" });
                return;
            }

            res.json({ success: true, message: "Item removed from cart" });
        })
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