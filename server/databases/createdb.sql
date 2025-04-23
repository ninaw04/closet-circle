CREATE TABLE `User`(
	email VARCHAR(35) PRIMARY KEY,
first_name VARCHAR(40),
	last_name VARCHAR(40),
	join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	bio VARCHAR(350)
);

CREATE TABLE Friend(
	email VARCHAR(35),
	friend_id VARCHAR(35),
	PRIMARY KEY (email, friend_id),
	FOREIGN KEY (email) REFERENCES User(email) ON DELETE CASCADE,
	FOREIGN KEY (friend_id) REFERENCES User(email) ON DELETE CASCADE
);


CREATE TABLE Closet(
	closet_id INTEGER AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(60) UNIQUE NOT NULL,
	public INTEGER NOT NULL DEFAULT 1,
	member_count INTEGER DEFAULT 0, 
	description VARCHAR(500)
);


CREATE TABLE Closet_Membership(
	closet_id INTEGER NOT NULL,
	email VARCHAR(35) NOT NULL,
	PRIMARY KEY (closet_id, email),
	FOREIGN KEY (closet_id) REFERENCES Closet(closet_id) ON DELETE CASCADE,
	FOREIGN KEY (email) REFERENCES User(email) ON DELETE CASCADE
);


CREATE TABLE Closet_Creation(
	closet_id INTEGER NOT NULL,
	admin VARCHAR(35) NOT NULL,
	PRIMARY KEY (closet_id, admin),
	FOREIGN KEY (closet_id) REFERENCES Closet(closet_id) ON DELETE CASCADE,
	FOREIGN KEY (admin) REFERENCES User(email) ON DELETE CASCADE
);

CREATE TABLE Category (
	category_id INTEGER AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(40) NOT NULL UNIQUE
);

CREATE TABLE Post(
	post_id INTEGER AUTO_INCREMENT PRIMARY KEY,
	closet_id INTEGER NOT NULL,
	owner_id VARCHAR(35) NOT NULL,
	title VARCHAR(50), 
	likes INTEGER DEFAULT 0, 
	item_picture VARCHAR(500) NOT NULL,
	description VARCHAR(500),
	date_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	item_condition VARCHAR(70) NOT NULL,
	FOREIGN KEY (closet_id) REFERENCES Closet(closet_id) ON DELETE CASCADE,	
	FOREIGN KEY (owner_id) REFERENCES User(email) ON DELETE CASCADE
);


CREATE TABLE Borrow(
	post_id INTEGER PRIMARY KEY,
	rental_start_date DATE NOT NULL,
	rental_end_date DATE NOT NULL,
	FOREIGN KEY (post_id) REFERENCES Post(post_id) ON DELETE CASCADE	
);


CREATE TABLE Sell(
	post_id INTEGER PRIMARY KEY,
	price DECIMAL(20, 2) NOT NULL,
	FOREIGN KEY (post_id) REFERENCES Post(post_id) ON DELETE CASCADE	
);

CREATE TABLE Wishlist(
	name VARCHAR(35),
	email VARCHAR(35),
	post_id INTEGER, 
	PRIMARY KEY (name, email, post_id),
	FOREIGN KEY (email) REFERENCES User(email) ON DELETE CASCADE,
	FOREIGN KEY (post_id) REFERENCES Post(post_id) ON DELETE CASCADE
);

CREATE TABLE Comment(
	comment_id INTEGER AUTO_INCREMENT PRIMARY KEY,
	email VARCHAR(35) NOT NULL,
	post_id INTEGER NOT NULL,
	text VARCHAR(600) NOT NULL,
	publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (email) REFERENCES User(email) ON DELETE CASCADE,
	FOREIGN KEY (post_id) REFERENCES Post(post_id) ON DELETE CASCADE
);


CREATE TABLE Review(
	review_id INTEGER AUTO_INCREMENT PRIMARY KEY,
	email VARCHAR(35) NOT NULL,
	reviewer VARCHAR(35) NOT NULL,
	publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	rating INTEGER NOT NULL,
	text VARCHAR(600) NOT NULL,
	FOREIGN KEY (email) REFERENCES User(email) ON DELETE CASCADE,
	FOREIGN KEY (reviewer) REFERENCES User(email) ON DELETE CASCADE
);


CREATE TABLE Transactions(
	transaction_id INTEGER AUTO_INCREMENT PRIMARY KEY,
	email VARCHAR(35) NOT NULL,
	post_id INTEGER NOT NULL,
	notes VARCHAR(350),
transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (email) REFERENCES User(email) ON DELETE CASCADE,
	FOREIGN KEY (post_id) REFERENCES Post(post_id) ON DELETE CASCADE
);

CREATE TABLE User_Like(
	post_id INTEGER NOT NULL,
	email VARCHAR(35) NOT NULL,
	PRIMARY KEY (post_id, email),
	FOREIGN KEY (email) REFERENCES User(email) ON DELETE CASCADE,
	FOREIGN KEY (post_id) REFERENCES Post(post_id) ON DELETE CASCADE
);


CREATE TABLE Invitation (
	invitation_id INTEGER AUTO_INCREMENT PRIMARY KEY,
	inviter VARCHAR(35) NOT NULL, 
	invitee VARCHAR(35) NOT NULL,
	closet_id INTEGER NOT NULL,
	time_sent TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	status VARCHAR(15) DEFAULT 'pending',
	FOREIGN KEY (inviter) REFERENCES User(email) ON DELETE CASCADE,
	FOREIGN KEY (invitee) REFERENCES User(email) ON DELETE CASCADE,
	FOREIGN KEY (closet_id) REFERENCES Closet(closet_id) ON DELETE CASCADE
);

CREATE TABLE Post_Category (
	post_id INTEGER NOT NULL,
	category_id INTEGER NOT NULL,
	PRIMARY KEY (post_id, category_id),
	FOREIGN KEY (post_id) REFERENCES Post(post_id) ON DELETE CASCADE,
	FOREIGN KEY (category_id) REFERENCES Category(category_id) ON DELETE CASCADE
);

INSERT INTO User(email, first_name, last_name, join_date, bio) VALUES
('user1@email.com', 'John', 'Smith', '2025-04-01', 'Bio for user 1'),
('user2@email.com', 'Jane', 'Doe', '2025-04-02', 'Bio for user 2'),
('user3@email.com', 'Mary', 'Nguyen', '2025-04-03', 'Bio for user 3'),
('user4@email.com', 'Sally', 'Lopez', '2025-04-04', 'Bio for user 4'),
('user5@email.com', 'Joe', 'Gonzalez', '2025-04-05', 'Bio for user 5'),
('user6@email.com', 'Richard', 'Miller', '2025-04-06', 'Bio for user 6'),
('user7@email.com', 'Robert', 'Tan', '2025-04-07', 'Bio for user 7');

INSERT INTO Closet(closet_id, name, public, description) VALUES
(1, 'Closet 1', 1, 'public closet 1'),
(2, 'Closet 2', 1, 'public closet 2'),
(3, 'Closet 3', 0, 'public closet 3'),
(4, 'Closet 4', 0, 'private closet 4'),
(5, 'Closet 5', 0, 'private closet 5');

INSERT INTO Closet_Membership(closet_id, email) VALUES
(1, 'user1@email.com'),
(1, 'user2@email.com'),
(1, 'user3@email.com'),
(1, 'user4@email.com'),
(2, 'user3@email.com'),
(2, 'user4@email.com'),
(2, 'user5@email.com'),
(2, 'user6@email.com'),
(3, 'user1@email.com'),
(3, 'user5@email.com'),
(3, 'user7@email.com'),
(4, 'user2@email.com'),
(4, 'user3@email.com'),
(4, 'user6@email.com'),
(4, 'user7@email.com'),
(5, 'user4@email.com'),
(5, 'user5@email.com'),
(5, 'user6@email.com'),
(5, 'user7@email.com'),
(2, 'user2@email.com'),
(3, 'user2@email.com'),
(1, 'user5@email.com'),
(2, 'user1@email.com'),
(5, 'user1@email.com'),
(4, 'user1@email.com');

INSERT INTO Category(category_id, name) VALUES
(1, 'Shirts'),
(2, 'Shoes'),
(3, 'Jackets'),
(4, 'Pants'),
(5, 'Dresses'),
(6, 'Women’s'),
(7, 'Men’s'),
(8, 'Summer'),
(9, 'Fall'),
(10, 'Winter'),
(11, 'Spring');


INSERT INTO Post(post_id, closet_id, owner_id, title, likes, item_picture, description, date_posted, item_condition) VALUES
(1, 1, 'user1@email.com', 'Black Shirt', 7, 'https://img.sonofatailor.com/images/customizer/product/extra-heavy-cotton/ss/Black.jpg', 'Description 1', '2025-04-01', 'good'),
(2, 1, 'user2@email.com', 'Nike Dunk High Shoes', 13, 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.nike.com%2Fu%2Fcustom-nike-dunk-high-by-you-shoes-10001378&psig=AOvVaw0FkeDJQ639ppBOdWSltz0I&ust=1745160650519000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNjIg5es5IwDFQAAAAAdAAAAABAE', 'Description 2', '2025-04-02', 'excellent'),
(3, 2, 'user3@email.com', 'Oxford Brogue Shoes', 2, 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fus.barkershoes.com%2Fproducts%2Fvaliant-multi-multi-coloured&psig=AOvVaw0FkeDJQ639ppBOdWSltz0I&ust=1745160650519000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNjIg5es5IwDFQAAAAAdAAAAABAJ', 'Description 3', '2025-04-03', 'worn'),
(4, 2, 'user4@email.com', 'Women’s Cargo Pants', 18, 'https://cdni.llbean.net/is/image/wim/505026_33335_41?hei=1095&wid=950&resMode=sharp2&defaultImage=llbprod/505026_0_44', 'Description 4', '2025-04-04', 'good'),
(5, 2, 'user5@email.com', 'Women’s Flower Dress', 0, 'https://itsmilla.com/cdn/shop/files/MILLA_117_1024x.jpg?v=1696266364', 'Description 5', '2025-04-05', 'excellent'),
(6, 2, 'user6@email.com', 'White Shirt', 11, 'https://img.sonofatailor.com/images/customizer/product/White_O_Crew_Regular_NoPocket.jpg', 'Description 6', '2025-04-05', 'good'),
(7, 3, 'user7@email.com', 'Red Shirt', 5, 'https://i5.walmartimages.com/seo/Red-Shirt-for-Men-Gildan-2000-Men-T-Shirt-Cotton-Men-Shirt-Men-s-Trendy-Shirts-Best-Mens-Classic-Short-Sleeve-T-shirt_b41bd905-f204-4666-8b42-140387381a0b.32043a79df9d2166b1ed7b576bda9e21.jpeg', 'Description 7', '2025-04-05', 'worn'),
(8, 3, 'user1@email.com', 'Button Up Shirt', 20, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVwrUty2m4obSlIzk1U-o5YFvpNdqjGqf0gw&s', 'Description 8', '2025-04-01', 'good'),
(9, 3, 'user1@email.com', 'Retro Sneakers', 3, 'https://www.google.com/url?sa=i&url=https%3A%2F%2Forigoshoes.com%2Fproducts%2Fthe-retro-sneaker-gen3-in-natural-leather-sand-men&psig=AOvVaw0FkeDJQ639ppBOdWSltz0I&ust=1745160650519000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNjIg5es5IwDFQAAAAAdAAAAABAT', 'Description 9', '2025-04-02', 'excellent'),
(10, 4, 'user2@email.com', 'Women’s Leather Shoes', 9, 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.etsy.com%2Flisting%2F1225745832%2Fgenuine-leather-womens-shoes-handmade&psig=AOvVaw0FkeDJQ639ppBOdWSltz0I&ust=1745160650519000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNjIg5es5IwDFQAAAAAdAAAAABAZ', 'Description 10', '2025-04-11', 'worn'),
(11, 4, 'user2@email.com', 'Puma x Lamelo Shoes', 1, 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fus.puma.com%2Fus%2Fen%2Fpd%2Fpuma-x-lamelo-ball-mb-04-iridescent-mens-basketball-shoes%2F310836&psig=AOvVaw0FkeDJQ639ppBOdWSltz0I&ust=1745160650519000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNjIg5es5IwDFQAAAAAdAAAAABAf', 'Description 11', '2025-04-11', 'good'),
(12, 4, 'user3@email.com', 'Old Navy Bomber Jacket', 16, 'https://oldnavy.gap.com/webcontent/0053/972/733/cn53972733.jpg', 'Description 12', '2025-04-07', 'excellent'),
(13, 4, 'user3@email.com', 'Brown Work Pants', 8, 'https://truewerk.com/cdn/shop/files/t1_werkpants_mens_olive_flat_lay_4825e693-f588-4813-bff0-1d4c46ce82ce.jpg?v=1713822726', 'Description 13', '2025-04-09', 'good'),
(14, 4, 'user4@email.com', 'Mini Rose Dress', 14, 'https://itsmilla.com/cdn/shop/files/MILLA_153_b6d2885e-3c17-4f05-b7de-f2319fa0fd12_1024x.jpg?v=1731517611', 'Description 14', '2025-04-11', 'worn'),
(15, 5, 'user5@email.com', 'Vintage Swing Party Dress', 6, 'https://m.media-amazon.com/images/I/614gnlfQt2L._AC_SL1500_.jpg', 'Description 15', '2025-04-02', 'excellent');

INSERT INTO Post_Category (post_id, category_id) VALUES
(1, 1),
(1, 7),
(1, 11),
(1, 8),
(2, 2),
(2, 8),
(2, 9),
(2, 10),
(2, 11),
(3, 3),
(3, 7),
(3, 9),
(3, 10),
(4, 4),
(4, 6),
(4, 9),
(4, 10),
(4, 11),
(5, 5),
(5, 6),
(5, 8),
(5, 11),
(6, 1),
(6, 11),
(6, 8),
(7, 1),
(7, 11),
(7, 8),
(8, 1),
(8, 11),
(8, 8),
(9, 2),
(9, 8),
(9, 9),
(9, 10),
(9, 11),
(10, 2),
(10, 6),
(10, 8),
(10, 9),
(10, 10),
(10, 11),
(11, 2),
(11, 8),
(11, 9),
(11, 10),
(11, 11),
(12, 3),
(12, 9),
(12, 10),
(13, 4),
(13, 9),
(13, 10),
(13, 11),
(14, 5),
(14, 6),
(14, 8),
(14, 11),
(15, 5),
(15, 6),
(15, 8),
(15, 11); 

INSERT INTO Borrow (post_id, rental_start_date, rental_end_date)  
VALUES  
(1, '2025-04-25', '2025-05-02'),  
(2, '2025-04-26', '2025-04-28'),
(3, '2025-04-28', '2025-04-30'),
(4, '2025-05-06', '2025-05-26'),
(5, '2025-05-08', '2025-05-11'),
(6, '2025-05-16', '2025-05-28'),
(7, '2025-05-22', '2025-05-25'),
(8, '2025-05-26', '2025-06-01');

INSERT INTO Sell (post_id, price)  
VALUES  
(9, 29.99),  
(10, 9.99),  
(11, 1.99),  
(12, 12.99),  
(13, 4.99),  
(14, 6.99),  
(15, 10.99);

INSERT INTO Transactions (transaction_id, email, post_id, transaction_date, notes)  
VALUES  
(1, 'user2@email.com', 1, '2025-04-22 14:52:00', ''),  
(2, 'user3@email.com', 2, '2025-04-22 14:52:00', ''),   
(3, 'user4@email.com', 3, '2025-04-22 14:52:00', ''),    
(4, 'user5@email.com', 4, '2025-04-22 14:52:00', ''),   
(5, 'user6@email.com', 5, '2025-04-22 14:52:00', ''),    
(6, 'user7@email.com', 6, '2025-04-22 14:52:00', ''),   
(7, 'user1@email.com', 7, '2025-04-22 14:52:00', ''),  
(8, 'user2@email.com', 8, '2025-04-22 14:52:00', ''),  
(9, 'user5@email.com', 9, '2025-04-22 14:52:00', ''),  
(10, 'user6@email.com', 10, '2025-04-22 14:52:00', ''),    
(11, 'user7@email.com', 11, '2025-04-22 14:52:00', ''),  
(12, 'user1@email.com', 12, '2025-04-22 14:52:00', ''),   
(13, 'user2@email.com', 13, '2025-04-22 14:52:00', ''),  
(14, 'user3@email.com', 14, '2025-04-22 14:52:00', ''),  
(15, 'user4@email.com', 15, '2025-04-22 14:52:00', '');

