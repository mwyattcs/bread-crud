---CREATE---

-- add a new Bakery
INSERT INTO Bakeries (name, email, address) VALUES (:nameInput, :emailInput, :addressInput);

-- add a new Customer
INSERT INTO Customers (name, email, address) VALUES (:nameInput, :emailInput, :addressInput);

-- add a new Order
INSERT INTO Orders (order_total, order_date, bakery_id, customer_id)
VALUES (:orderTotalInput, :orderDateInput, :bakeryIDInput, :customerIDInput);

-- add a new Product Category
INSERT INTO Product_Categories (category_name) VALUES (:categoryNameInput);

-- add new Products_has_Orders
INSERT INTO Products_has_Orders (product_id, order_id, quantity) VALUES (:productInput, :orderInput, :quantityInput)

-- add a new Product
INSERT INTO Products (product_name, product_price, quantity_in_stock, bakery_id, product_category_id) 
VALUES (:productNameInput, :productPriceInput, :quantityInStockInput, :bakeryIDInput, :productCategoryIDInput);


---READ---

-- get all Bakery IDs and Names to populate the dropdown menu
SELECT bakery_id, name FROM Bakeries;

-- get all Customer IDs and Names to populate the dropdown menu
SELECT customer_id, name FROM Customers;

-- get all Order IDs and Dates to populate the dropdown menu
SELECT order_id, order_date FROM Orders;

-- get all Product Category IDs and Names to populate the dropdown menu
SELECT product_category_id, category_name FROM Product_Categories;

-- get all Quantity, Product IDs, Order IDs to populate the dropdown menu
SELECT product_id, order_id, quantity FROM Products_has_Orders

-- get all Product IDs and Names to populate the dropdown menu
SELECT product_id, product_name FROM Products;

-- search orders by customer name
SELECT * 
FROM Orders
JOIN Customers
ON Customers.customer_id = Orders.customer_id
WHERE customer_id = (
    SELECT customer_id
    FROM Customers
    WHERE customer_name = :user_input);

---UPDATE---

-- update Bakery info
UPDATE Bakeries SET name = :bakeryInput, email = :emailInput, address = :addressInput WHERE bakery_id = :bakerySelectedFromDropdown

-- update Products
UPDATE Products SET product_name = :productNameInput, product_price = :productPriceInput, quantity_in_stock = :quantityInStockInput, bakery_id = :bakerySelectedFromDropdown, product_category_id = :productCategorySelectedFromDropdown WHERE product_id = :productCategorySelectedFromDropdown

-- update Orders
UPDATE Orders SET order_total = :orderTotalInput, order_date = :orderDateInput, bakery_id = :bakerySelectedFromDropdown, customer_id = :CustomerSelectedFromDropdown WHERE order_id = :OrderSelectedFromDropdown

-- update Products_has_orders
UPDATE Products_has_Orders SET quantity = :quantityInput, WHERE order_id = :OrderSelectedFromDropdown AND product_id = :ProductSelectedFromDropdown


---DELETE---

-- delete Bakery
DELETE FROM Bakeries WHERE bakery_id = :bakerySelectedFromDropdown

-- delete Products
DELETE FROM Products WHERE product_id = :ProductSelectedFromDropdown

-- delete Orders
DELETE FROM Orders WHERE order_id = OrderSelectedFromDropdown

-- delete Products_has_Orders
DELETE FROM Products_has_Orders WHERE product_id = ProductSelectedFromDropdown AND order_id = OrderSelectedFromDropdown