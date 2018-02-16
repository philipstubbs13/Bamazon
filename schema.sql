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
	PRIMARY KEY (item_id)
);