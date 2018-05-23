CREATE DATABASE bamazon_db;

USE bamazon_db;;

CREATE TABLE products (
    item_id VARCHAR(30) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(300) NOT NULL,
    department_name VARCHAR(100),
    price DECIMAL(10,2),
    stock_quantity INTEGER(11),
    PRIMARY KEY (item_id)
);