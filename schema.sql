DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	-- Unique id for each product --
    item_id INT(11) AUTO_INCREMENT NOT NULL,
    -- Name of product --
	product_name VARCHAR(100) NOT NULL,
    -- Department name --
	department_name VARCHAR(100) NOT NULL,
    -- Cost to customer --
	price DECIMAL(10,2) NOT NULL,
    -- How much of the product is available in stores. --
	stock_quantity INT(11) NOT NULL,
    -- Make item_id the primary key --
    product_sales DECIMAL (10,2) NOT NULL,
	PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales)
VALUES ("Downhill skis", "Winter Sports", 225.89, 35, 0), 
("Under Armour Stephen Curry Indoor/Outdoor Basketball", "Team Sports", 29.00, 25, 0),
("Kayak", "Water Sports", 149.89, 20, 0),
("Hockey stick", "Winter Sports", 68.88, 37, 0),
("Paddleboard", "Water Sports", 299.99, 18, 0),
("Tent", "Camping and Hiking", 39.79, 23, 0),
("Backpack", "Camping and Hiking", 35.49, 15, 0),
("Mountain Bike", "Cycling", 131.99, 10, 0),
("Hockey skates", "Winter Sports", 69.99, 22, 0),
("Fitbit Flex 2", "Exercise and Fitness", 59.00, 14, 0),
("Soccer Ball", "Team Sports", 15.00, 16, 0)

CREATE TABLE departments (
	-- Unique id for each department --
    department_id INT(11) AUTO_INCREMENT NOT NULL,
    -- Name of department --
	department_name VARCHAR(100) NOT NULL,
    -- Dummy number set for each department --
	over_head_costs VARCHAR(100) NOT NULL,
	PRIMARY KEY (department_id)
);

ALTER TABLE products
  ADD product_sales DECIMAL(10,2) NOT NULL;

ALTER TABLE products DROP COLUMN product_sales;

