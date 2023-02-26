/* 
    Group 134
    Ellen Ebert
    Michael Wyatt
*/ 

/* Disable commits and foreign key checks */
SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;


/* Create Customers Table */
DROP TABLE IF EXISTS Customers;
CREATE TABLE Customers (
  customer_id int(11) NOT NULL AUTO_INCREMENT UNIQUE,
  name varchar(100) NOT NULL,
  email varchar(100) NOT NULL UNIQUE,
  address varchar(250) NOT NULL,
  PRIMARY KEY (customer_id)
);

/* Populate Customers with sample data */
INSERT INTO Customers (customer_id, name, email, address)
VALUES (1,'Ellen','ellen@fakeemail.com','123 Apple St.'), (2, 'Michael', 'michael@fakeemail.com', '456 Banana St.'), (3, 'Alyssa', 'alyssa@fakeemail.com', '789 Orange St.');




/* Create Bakeries Table */
DROP TABLE IF EXISTS Bakeries;
CREATE TABLE Bakeries (
  bakery_id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(100) NOT NULL,
  email varchar(100) NOT NULL UNIQUE,
  address varchar(250) NOT NULL,
  PRIMARY KEY (bakery_id)
);

/* Populate Bakeries with sample data */
INSERT INTO Bakeries (bakery_id, name, email, address)
VALUES (1,'Bread and Butter','bandb@fakeemail.com', '123 A Street'), (2, 'Cool Bakery', 'coolb@fakeemail.com', '456 B Street'), (3, 'The Best Bakery', 'tbb@fakeemail.com', '789 C Street');




/* Create Product_Categories Table */
DROP TABLE IF EXISTS Product_Categories;
CREATE TABLE Product_Categories (
  product_category_id int(11) NOT NULL AUTO_INCREMENT UNIQUE,
  category_name varchar(100) NOT NULL,
  PRIMARY KEY (product_category_id)
);

/* Populate Product_Categories with sample data */
INSERT INTO Product_Categories (product_category_id, category_name)
VALUES (1, 'Bread'), (2, 'Cake'), (3, 'Muffin');




/* Create Products Table */
DROP TABLE IF EXISTS Products;
CREATE TABLE Products (
  product_id int(11) NOT NULL AUTO_INCREMENT UNIQUE,
  product_name varchar(200),
  product_price int,
  quantity_in_stock int,
  bakery_id int(11) NULL,
  product_category_id int(11),
  PRIMARY KEY (product_id),
  FOREIGN KEY (bakery_id) REFERENCES Bakeries(bakery_id),
  FOREIGN KEY (product_category_id) REFERENCES Product_Categories(product_category_id)
);

/* Populate Products with sample data */
INSERT INTO Products (product_id, product_name, product_price, quantity_in_stock, bakery_id, product_category_id)
VALUES (1, 'Sourdough Loaf', 5, 10, (SELECT bakery_id FROM Bakeries WHERE name='Bread and Butter'), (SELECT product_category_id FROM Product_Categories WHERE category_name='Bread')), 
(2, 'Baguette', 7, 20, (SELECT bakery_id FROM Bakeries WHERE name='Cool Bakery'), (SELECT product_category_id FROM Product_Categories WHERE category_name='Bread')),
(3, 'Croissant', 2, 30, (SELECT bakery_id FROM Bakeries WHERE name='The Best Bakery'), (SELECT product_category_id FROM Product_Categories WHERE category_name='Bread')), 
(4, 'Chocolate Cake', 10, 40, (SELECT bakery_id FROM Bakeries WHERE name='Bread and Butter'), (SELECT product_category_id FROM Product_Categories WHERE category_name='Cake')),
(5, 'Blueberry Muffin', 4, 50, (SELECT bakery_id FROM Bakeries WHERE name='Cool Bakery'), (SELECT product_category_id FROM Product_Categories WHERE category_name='Muffin'));




/* Create Orders Table */
DROP TABLE IF EXISTS Orders;
CREATE TABLE Orders (
  order_id int(11) NOT NULL AUTO_INCREMENT UNIQUE,
  order_total int NOT NULL,
  order_date datetime NOT NULL,
  bakery_id int(11),
  customer_id int(11),
  PRIMARY KEY (order_id),
  FOREIGN KEY (bakery_id) REFERENCES Bakeries(bakery_id),
  FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

/* Populate Orders with sample data */
INSERT INTO Orders (order_id, order_total, order_date, bakery_id, customer_id)
VALUES (1, 10, '2023-01-01 01:11:00', (SELECT bakery_id FROM Bakeries WHERE name='Bread and Butter'), (SELECT customer_id FROM Customers WHERE name='Ellen')), 
(2, 14, '2023-01-02 02:22:00', (SELECT bakery_id FROM Bakeries WHERE name='Cool Bakery'), (SELECT customer_id FROM Customers WHERE name='Michael')), 
(3, 6, '2023-01-03 03:33:00', (SELECT bakery_id FROM Bakeries WHERE name='The Best Bakery'), (SELECT customer_id FROM Customers WHERE name='Alyssa'));




/* Create Products_has_Orders Table */
DROP TABLE IF EXISTS Products_has_Orders;
CREATE TABLE Products_has_Orders (
  order_id int(11),
  product_id int(11),
  quantity int(11),
  PRIMARY KEY (order_id, product_id),
  FOREIGN KEY (order_id) REFERENCES Orders(order_id),
  FOREIGN KEY (product_id) REFERENCES Products(product_id)
  ON DELETE CASCADE
);

/* Populate Products_has_Orders with sample data */
INSERT INTO Products_has_Orders (order_id, product_id, quantity)
VALUES (1, (SELECT product_id FROM Products WHERE product_name='Sourdough Loaf'), 2), 
(2, (SELECT product_id FROM Products WHERE product_name='Baguette'), 2), 
(3, (SELECT product_id FROM Products WHERE product_name='Croissant'), 3);



/* Check that all tables were created and populated correctly */
Select * FROM Customers;
Select * FROM Bakeries;
Select * FROM Product_Categories;
Select * FROM Products;
Select * FROM Orders;
Select * FROM Products_has_Orders;


SET FOREIGN_KEY_CHECKS=1;
COMMIT;