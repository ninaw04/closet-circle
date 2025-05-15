

CREATE TABLE "User"(
	email VARCHAR(60) PRIMARY KEY,
	first_name VARCHAR(40),
	last_name VARCHAR(40),
	join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	bio VARCHAR(350)
);

CREATE TABLE Friend(
	email VARCHAR(60),
	friend_id VARCHAR(60),
	PRIMARY KEY (email, friend_id),
	FOREIGN KEY (email) REFERENCES User(email) ON DELETE CASCADE,
	FOREIGN KEY (friend_id) REFERENCES User(email) ON DELETE CASCADE
);

CREATE TABLE Closet(
	closet_id INTEGER PRIMARY KEY AUTOINCREMENT,
	name VARCHAR(60) UNIQUE NOT NULL,
	public INTEGER NOT NULL DEFAULT 1,
	member_count INTEGER DEFAULT 0, 
	description VARCHAR(500)
);

CREATE TABLE Closet_Membership(
	closet_id INTEGER NOT NULL,
	email VARCHAR(60) NOT NULL,
	PRIMARY KEY (closet_id, email),
	FOREIGN KEY (closet_id) REFERENCES Closet(closet_id) ON DELETE CASCADE,
	FOREIGN KEY (email) REFERENCES User(email) ON DELETE CASCADE
);

CREATE TABLE Closet_Creation(
	closet_id INTEGER NOT NULL,
	admin VARCHAR(60) NOT NULL,
	PRIMARY KEY (closet_id, admin),
	FOREIGN KEY (closet_id) REFERENCES Closet(closet_id) ON DELETE CASCADE,
	FOREIGN KEY (admin) REFERENCES User(email) ON DELETE CASCADE
);

CREATE TABLE Category (
	category_id INTEGER PRIMARY KEY AUTOINCREMENT,
	name VARCHAR(40) NOT NULL UNIQUE
);

CREATE TABLE Post(
	post_id INTEGER PRIMARY KEY AUTOINCREMENT,
	closet_id INTEGER NOT NULL,
	owner_id VARCHAR(60) NOT NULL,
	title VARCHAR(50), 
	likes INTEGER DEFAULT 0, 
	description VARCHAR(500),
	date_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	item_condition VARCHAR(70) NOT NULL,
	size VARCHAR(25) NOT NULL,
	price REAL,
 	bflag INTEGER DEFAULT 0,
    sflag INTEGER DEFAULT 0,
   	 rental_end_date DATE,
	FOREIGN KEY (closet_id) REFERENCES Closet(closet_id) ON DELETE CASCADE,	
	FOREIGN KEY (owner_id) REFERENCES User(email) ON DELETE CASCADE
);

CREATE TABLE Post_Image (
	image_id INTEGER PRIMARY KEY AUTOINCREMENT,
	post_id INTEGER NOT NULL,
	image_url VARCHAR(500) NOT NULL,
	FOREIGN KEY (post_id) REFERENCES Post(post_id) ON DELETE CASCADE
);

CREATE TABLE Wishlist(
	email VARCHAR(60),
	post_id INTEGER, 
	PRIMARY KEY (email, post_id),
	FOREIGN KEY (email) REFERENCES User(email) ON DELETE CASCADE,
	FOREIGN KEY (post_id) REFERENCES Post(post_id) ON DELETE CASCADE
);

CREATE TABLE Comment(
	comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
	email VARCHAR(60) NOT NULL,
	post_id INTEGER NOT NULL,
	text VARCHAR(600) NOT NULL,
	publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (email) REFERENCES User(email) ON DELETE CASCADE,
	FOREIGN KEY (post_id) REFERENCES Post(post_id) ON DELETE CASCADE
);

CREATE TABLE Review(
	review_id INTEGER PRIMARY KEY AUTOINCREMENT,
	email VARCHAR(60) NOT NULL,
	reviewer VARCHAR(60) NOT NULL,
	publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	rating INTEGER NOT NULL,
	text VARCHAR(600) NOT NULL,
	FOREIGN KEY (email) REFERENCES User(email) ON DELETE CASCADE,
	FOREIGN KEY (reviewer) REFERENCES User(email) ON DELETE CASCADE
);

CREATE TABLE Transactions (
    transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(60) NOT NULL,
    status TEXT DEFAULT 'pending',
    purchased_date TIMESTAMP,  
    FOREIGN KEY (email) REFERENCES User(email) ON DELETE CASCADE
);

CREATE TABLE Transaction_Listing (
    transaction_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    PRIMARY KEY (transaction_id, post_id),
    FOREIGN KEY (transaction_id) REFERENCES Transactions(transaction_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES Post(post_id) ON DELETE CASCADE
);

CREATE TABLE User_Like(
	post_id INTEGER NOT NULL,
	email VARCHAR(60) NOT NULL,
	PRIMARY KEY (post_id, email),
	FOREIGN KEY (email) REFERENCES User(email) ON DELETE CASCADE,
	FOREIGN KEY (post_id) REFERENCES Post(post_id) ON DELETE CASCADE
);


CREATE TABLE Invitation (
	invitation_id INTEGER PRIMARY KEY AUTOINCREMENT,
	inviter VARCHAR(60) NOT NULL, 
	invitee VARCHAR(60) NOT NULL,
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

CREATE TRIGGER Empty_Cart_New_User
AFTER INSERT ON User
FOR EACH ROW
BEGIN
	INSERT INTO Transactions (email, status)
	VALUES (NEW.email, 'pending');
END;

CREATE TRIGGER New_Cart_After_Purchase
AFTER UPDATE ON Transactions
WHEN NEW.status = 'purchased' AND OLD.status = 'pending'
BEGIN
	UPDATE Transactions
	SET purchased_date = CURRENT_TIMESTAMP
	WHERE transaction_id = NEW.transaction_id;
    
	INSERT INTO Transactions (email, status)
	VALUES (NEW.email, 'pending');
END;

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
(1, 'Women’s'),
(2, 'Men’s'),
(3, 'Kids'),
(4, 'Tops'),
(5, 'Bottoms'),
(6, 'Outerwear'),
(7, 'Dresses'),
(8, 'Shoes'),
(9, 'Accessories'),
(10, 'Black'),
(11, 'White'),
(12, 'Red'),
(13, 'Blue'),
(14, 'Green'),
(15, 'Pink');

INSERT INTO Post(post_id, closet_id, owner_id, title, likes, description, date_posted, item_condition, size, price, bflag, sflag, rental_end_date) VALUES
(1, 1, 'user1@email.com', 'Gildan DryBlend T-Shirt', 7, 'Made from 100% cotton, this short-sleeve black shirt features a stretchy, lightweight, and breathable fabric in a solid color design', '2025-04-01', 'good', 'Medium', 10.99, 0, 1, NULL),
(2, 1, 'user2@email.com', 'Nike Dunk High Shoes', 13, 'Recalling the 1985 Be True to Your School Kentucky colorway, the Dunk High Kentucky released in June 2021. Built entirely with leather, the shoe’s upper appears in a mix of white and Game Royal, with perforations on the toe box providing breathability', '2025-04-02', 'excellent', 'X-Large', 79.99, 1, 0, '2025-05-02'),
(3, 2, 'user3@email.com', 'Valiant Oxford Brogue Shoes', 2, 'Valiant is a development on the long-standing Barker style Grant. Cut from high-quality unfinished crust leather, our collection of hand painted styles are individually painted with natural dyes to a rich and deep patina. Meaning each pair is unique in their shade and finish', '2025-04-03', 'worn', 'Small', 6.99, 1, 0, '2025-05-26'),
(4, 2, 'user4@email.com', 'L.L. Bean Women’s Cargo Pants', 18, 'Inspired by the hardworking style of classic cargo pants, made from ultra durable stretch cotton that’s washed to feel like an old favorite. Designed to move easily throughout the day, in a flattering straight leg that looks great rolled up or down', '2025-04-04', 'good', 'Large', 24.99, 1, 0, '2025-05-26'),
(5, 2, 'user5@email.com', 'Millia Hydrangea-Patterned Dress', 0, 'This charming midi dress features a delicate blue hydrangea pattern on sheer organza fabric, with a flowy silhouette perfect for garden parties or special occasions', '2025-04-05', 'excellent', 'X-Small', 74.99, 1, 0, NULL),
(6, 2, 'user6@email.com', 'Fruit of the Loom Crew Neck T-Shirt', 11, 'This shirt features reinforced shoulder-to-shoulder tape, double-needle stitching on the neck, sleeves, and hem, plus a high-density fabric that makes prints look sharp and clear', '2025-04-05', 'good', 'Medium', 8.99, 0, 1, NULL),
(7, 3, 'user7@email.com', 'Gildan Ultra Cotton T-Shirt', 5, 'This classic red tee is made from 100% cotton, giving it a soft and breathable feel. It’s got a simple, no-fuss design with short sleeves and a comfortable fit that works for everyday wear', '2025-04-05', 'worn', '4X-Large', 8.99, 0, 1, '2025-06-01'),
(8, 3, 'user1@email.com', 'Paul Fredrick Slim Fit Button Up Shirt', 20, 'This shirt looks like a classic denim shirt but is made from soft, breathable TENCEL™, making it really comfortable to wear. It features a Kent collar and a chest pocket, giving it a timeless style that works well both for casual outings and more polished looks', '2025-04-01', 'good', '3X-Large', 18.99, 1, 0, NULL),
(9, 3, 'user1@email.com', 'Origo Men’s Retro Sneakers', 3, 'The Retro Sneaker is a modern classic inspired by vintage styles, reimagined to fit barefoot principles.  Created with panels of certified natural leather and an amber sole for contrast', '2025-04-02', 'excellent', 'Small', 39.99, 0, 1, NULL),
(10, 4, 'user2@email.com', 'Derimi’O Women’s Leather Sneakers', 9, 'Crafted from high-quality genuine leather, these women’s fashion sneakers offer exceptional durability and timeless style. Perfect for women seeking womens white sneakers that combine fashion and comfort for everyday wear', '2025-04-11', 'worn', 'Large', 23.99, 0, 1, NULL),
(11, 4, 'user2@email.com', 'Puma x Lamelo Basketball Shoes', 1, 'Add dimension to your style and your game with LaMelo Ball’s latest signature shoe, the MB.04 Iridescent. Appearing in an attention-grabbing blue and purple colorway, the MB.04 is engulfed in alien tentacles with Melo phrases hidden in the design', '2025-04-11', 'good', 'Medium', 59.99, 1, 0, '2025-05-28'),
(12, 4, 'user3@email.com', 'Old Navy Zip Up Bomber Jacket', 16, 'This lightweight water resistant bomber jacket has a soft woven shell and a smooth taffeta lining, making it comfortable and easy to wear. It features rib-knit collar, cuffs, and hem for a snug fit, plus handy welt pockets and an interior snap-welt pocket to keep your phone or wallet safe', '2025-04-07', 'excellent', 'XX-Small', 2.99, 1, 0, '2025-05-28'),
(13, 4, 'user3@email.com', 'Truewerk Performance Work Pants', 8, 'Engineered for comfort and durability, the T1 WerkPant features lightweight, stretchy softshell fabric, articulated knees, and a variety of functional pockets. Designed for warm-weather work or outdoor activities, these pants offer excellent mobility, moisture-wicking performance, and a tailored fit that keeps you cool and comfortable all day long', '2025-04-09', 'good', 'Small', 44.99, 0, 1, NULL),
(14, 4, 'user4@email.com', 'Trailmade Insulated Hoodie', 14, 'Built to get you out hiking even when the temp drops, the women’s REI Co-op Trailmade insulated hoodie has 80 g synthetic insulation for 3-season warmth—and it layers perfectly under your rain shell', '2025-04-11', 'worn', 'X-Small', 39.99, 0, 1, NULL),
(15, 5, 'user5@email.com', '1950s Vintage Swing Party Dress', 6, 'This 50s classic dress is the perfect combination of style and comfort. Featuring a fitted wrap top with  a wide band waist that accentuates your figure, you’ll be turning heads at any party', '2025-04-02', 'good', 'X-Large', 18.99, 1, 0, '2025-06-05'),
(16, 4, 'user4@email.com', 'Millia Mini Rose Dress', 14, 'Strapless misty rose mini dress designed to turn heads with a blend of flirty and dramatic energy. The bodice is expertly draped to flatter your figure, leading into a structured skirt that’s beautifully adorned with delicate rosettes', '2025-04-11', 'excellent', 'X-Small', 19.99, 1, 0, NULL),
(17, 4, 'user7@email.com', 'Men’s Ring Glossy Dragon Pattern Glowing Ring', 14, 'This ring features a sleek, glossy finish adorned with a bold dragon pattern. Its glow-in-the-dark design adds a unique touch, making it stand out in low-light settings. Crafted from durable stainless steel, it’s both stylish and sturdy, suitable for various occasions', '2025-04-13', 'new', 'XX-Small', 6.99, 0, 1, NULL),
(18, 4, 'user1@email.com', 'Kids UPF 50+ Sun Hat', 14, 'This lightweight nylon sun hat offers UPF 50+ protection, shielding kids aged 2 to 10 from harmful UV rays. Designed with a wide brim and breathable mesh panels, it ensures comfort during outdoor play', '2025-04-19', 'good', 'X-Large', 11.99, 0, 1, NULL),
(19, 4, 'user2@email.com', 'Kids’ Twise Side-Kick 12" Dinosaur Backpack', 14, 'This backpack features a playful dinosaur design that’s sure to delight young adventurers. Its compact 12-inch size is perfect for preschoolers and kindergarteners, offering enough space for daily essentials without being bulky', '2025-04-19', 'new', 'Medium', 15.99, 0, 1, NULL),
(20, 4, 'user3@email.com', 'Women’s Squall Packable Rain Jacket', 14, 'Meet the Squall® raincoat with packable ease! Made with the same iconic sealed seams and waterproof finish, the wind and rain won’t stand a chance. An adjustable waist cinch not only adds a feminine flair, but it also gives you the option of a closer fit to keep the blustery wind out', '2025-03-29', 'worn', 'XX-Large', 54.99, 1, 0, NULL),
(21, 4, 'user5@email.com', 'A&F Women’s High Rise Flare Pant', 14, 'High rise pants, that are fitted at the waist and hips, slightly relaxed at the thigh and eases at the knee into a full-length flare leg shape', '2025-03-29', 'worn', 'Large', 17.99, 0, 1, NULL),
(22, 5, 'user6@email.com', 'Women’s Frame Shorts', 6, 'These white denim shorts have a relaxed fit with a mid-rise that sits comfortably high on the hips. They’ve got the classic five-pocket setup, belt loops, and a button-zip fly, so it is easy to throw on and pair with pretty much anything', '2025-02-23', 'good', 'X-Large', 12.99, 0, 1, '2025-06-05'),
(23, 5, 'user7@email.com', 'Barbour x ERDEM Dhalia Waxed Jacket', 6, 'The Barbour x ERDEM Dhalia Waxed Jacket features the signature tailored silhouette ERDEM is renowned for, with its cinched peplum waist which gives an ultra-feminine look', '2025-02-23', 'excellent', 'X-Small', 24.99, 1, 0, '2025-06-05'),
(24, 5, 'user4@email.com', 'Men’s Wide Basic Dress Belt', 6, 'Solid dress belt made from smooth Italian leather with a subtle shine and a clean buckle. Well-made and pairs easily with nice shoes', '2025-02-23', 'good', 'XX-Small', 5.99, 1, 0, '2025-06-05'),
(25, 5, 'user6@email.com', 'Borelle Red Women’s Belt', 6, 'Stylish and versatile, this red belt is a must-have accessory to complete all your put-together looks with ease', '2025-02-23', 'new', 'Small', 7.99, 0, 1, '2025-06-05'),
(26, 5, 'user7@email.com', 'Nordstrom Women’s Closed Toe Heels', 6, 'These pumps have a classic closed-toe design with a 3.5-inch heel, making them versatile for both office wear and formal occasions. The non-slip sole adds practicality, ensuring comfort and stability throughout the day', '2025-02-23', 'excellent', 'Large', 4.99, 1, 0, '2025-06-05');

INSERT INTO Post_Image(image_id, post_id, image_url) VALUES
(1, 1, 'https://img.sonofatailor.com/images/customizer/product/extra-heavy-cotton/ss/Black.jpg'),
(2, 2, 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/cbddd67b-444b-4a7c-b458-20643ab89b1b/custom-nike-dunk-high-by-you-shoes.png'),
(3, 3, 'https://img4.dhresource.com/webp/m/260x260/f3/albu/km/g/14/db741206-a7d4-4f31-8b51-b7db6f75a53e.jpg'),
(4, 4, 'https://cdni.llbean.net/is/image/wim/505026_33335_41?hei=1095&wid=950&resMode=sharp2&defaultImage=llbprod/505026_0_44'),
(5, 5, 'https://itsmilla.com/cdn/shop/files/MILLA_117_1024x.jpg?v=1696266364'),
(6, 6, 'https://img.sonofatailor.com/images/customizer/product/White_O_Crew_Regular_NoPocket.jpg'),
(7, 7, 'https://i5.walmartimages.com/seo/Red-Shirt-for-Men-Gildan-2000-Men-T-Shirt-Cotton-Men-Shirt-Men-s-Trendy-Shirts-Best-Mens-Classic-Short-Sleeve-T-shirt_b41bd905-f204-4666-8b42-140387381a0b.32043a79df9d2166b1ed7b576bda9e21.jpeg'),
(8, 8, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVwrUty2m4obSlIzk1U-o5YFvpNdqjGqf0gw&s'),
(9, 9, 'https://origoshoes.com/cdn/shop/files/ORIGO-Menretrosand-1.jpg?v=1708968977&width=900'),
(10, 10, 'https://nisolo.com/cdn/shop/products/WF-0001-LAT_Front_39695.jpg?v=1739936350'),
(11, 11, 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/310836/01/sv01/fnd/PNA/fmt/png/PUMA-x-LAMELO-BALL-MB.04-Iridescent-Men’s-Basketball-Shoes'),
(12, 12, 'https://oldnavy.gap.com/webcontent/0050/522/919/cn50522919.jpg'),
(13, 13, 'https://truewerk.com/cdn/shop/files/t1_werkpants_mens_olive_flat_lay_4825e693-f588-4813-bff0-1d4c46ce82ce.jpg?v=1713822726'),
(14, 14, 'https://www.rei.com/media/113a2be2-cd71-4eaf-bf73-273475fbd681.jpg'),
(15, 15, 'https://m.media-amazon.com/images/I/61su2-7Z7mL._AC_UY1000_.jpg'),
(16, 16, 'https://itsmilla.com/cdn/shop/files/MILLA_153_b6d2885e-3c17-4f05-b7de-f2319fa0fd12_1024x.jpg?v=1731517611'),
(17, 17, 'https://i5.walmartimages.com/asr/2186a74e-baaa-4dba-8170-fe1573859014.1624ac587e54e56821a9402c9d4ee46b.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF'),(18, 18, 'https://i5.walmartimages.com/seo/HEEHIPOO-Kids-Nylon-UPF-50-Sun-Hat-for-Toddlers-Boy-and-Girl-2-10-Years-Old_74e6f792-28a4-4ca4-a159-93495ef39564.cd7e713eab15eb638ad5cd59f9b3a724.jpeg?odnHeight=432&odnWidth=320&odnBg=FFFFFF'),
(19, 19, 'https://target.scene7.com/is/image/Target/GUEST_dc397d6c-d0ce-42a8-a79f-f67b34cae008?wid=300&hei=300&fmt=pjpeg'),
(20, 20, 'https://s7.landsend.com/is/image/LandsEnd/550298_LEPP_LF_88Y?$lg$'),
(21, 21, 'https://img.abercrombie.com/is/image/anf/KIC_156-4370-0288-900_prod1.jpg?policy=product-large'),
(22, 22, 'https://media.neimanmarcus.com/f_auto,q_auto:low,ar_4:5,c_fill,dpr_2.0,w_418/01/nm_4981084_100189_m'),
(23, 23, 'https://www.barbour.com/media/catalog/product/cache/76b3137555865caacddfe4231ec61fb4/L/W/LWX1478OL99_CARRYFORWARDa_flat.jpg'),
(24, 24, 'https://www.allenedmonds.com/blob/product-images/39099/ec/40/06789/ec4006789_single_feed1000.jpg'),
(25, 25, 'https://media.aldoshoes.com/v3/product/borelle/600/borelle_red_600_main_sq_gy_1200x1200.jpg'),
(26, 26, 'https://www.samedelman.com/blob/product-images/99900/ec/02/20419/ec0220419_pair_feed1000.jpg');

INSERT INTO Post_Category (post_id, category_id) VALUES
(1, 2),
(1, 4),
(1, 10),
(2, 2),
(2, 8),
(2, 11),
(2, 13),
(3, 2),
(3, 8),
(3, 12),
(3, 13),
(3, 14),
(4, 1),
(4, 5),
(5, 1),
(5, 7),
(5, 11),
(5, 13),
(6, 2),
(6, 4),
(6, 11),
(7, 2),
(7, 4),
(7, 12),
(8, 2),
(8, 4),
(8, 13),
(9, 2),
(9, 8),
(10, 1),
(10, 8),
(11, 2),
(11, 8),
(11, 13),
(11, 15),
(12, 2),
(12, 6),
(12, 10),
(13, 2),
(13, 5),
(14, 1),
(14, 6),
(14, 14),
(15, 1),
(15, 7),
(15, 10),
(16, 1),
(16, 7),
(16, 15),
(17, 2),
(17, 9),
(17, 10),
(17, 13),
(18, 3),
(18, 9),
(18, 11),
(18, 15),
(19, 3),
(19, 9),
(19, 13),
(19, 14),
(20, 1),
(20, 6),
(20, 13),
(21, 1),
(21, 5),
(21, 10),
(22, 1),
(22, 5),
(22, 11),
(23, 1),
(23, 6),
(23, 10),
(24, 2),
(24, 9),
(24, 10),
(25, 1),
(25, 9),
(25, 12),
(26, 1),
(26, 8),
(26, 10);

INSERT INTO Transactions (email, status, purchased_date) VALUES  
('user2@email.com', 'purchased', '2025-04-22 14:52:00'),  
('user3@email.com', 'pending', NULL),  
('user4@email.com', 'purchased', '2025-04-22 14:52:00'),  
('user5@email.com', 'purchased', '2025-04-22 14:52:00'),  
('user6@email.com', 'pending', NULL),  
('user7@email.com', 'purchased', '2025-04-22 14:52:00'),  
('user1@email.com', 'pending', NULL),  
('user2@email.com', 'purchased', '2025-04-22 14:52:00'),
('user2@email.com', 'pending', NULL),
('user4@email.com', 'pending', NULL),
('user5@email.com', 'pending', NULL),
('user7@email.com', 'pending', NULL);

INSERT INTO Transaction_Listing (transaction_id, post_id) VALUES  
(1, 1),
(1, 2),
(2, 3),  
(2, 4),  
(3, 5),  
(4, 6),  
(4, 7),  
(4, 8),  
(5, 9),  
(5, 10),  
(6, 11),  
(6, 12),
(7, 13),  
(8, 14),  
(8, 15);

INSERT INTO Wishlist (email, post_id) VALUES
('user1@email.com', 2),
('user1@email.com', 1),
('user1@email.com', 5),
('user2@email.com', 3),
('user2@email.com', 10),
('user3@email.com', 12),
('user2@email.com', 4),
('user4@email.com', 15),
('user4@email.com', 14),
('user5@email.com', 5),
('user5@email.com', 15),
('user6@email.com', 6),
('user7@email.com', 7);