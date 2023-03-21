// Citation for this code:
// Date: 3/2/23
// Based on NodeJS Starter App, written for CS 340
// https://github.com/osu-cs340-ecampus/nodejs-starter-app

/*
    SETUP
*/

// Express
const express = require('express');
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

PORT = 9126;

// Database
const db = require('./database/db-connector');

// Handlebars
const exphbs = require('express-handlebars');
app.engine('.hbs', exphbs.engine({
    extname: ".hbs"
}));
app.set('view engine', '.hbs');

// Static Files
app.use(express.static('public'));


/*
    ROUTES
*/

// GET ROUTES //

app.get('/', function (req, res) {
    res.render('index')
});

app.get('/index', function (req, res) {
    res.render('index')
});

app.get('/products', function (req, res) {
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.name === undefined) {
        query1 = "SELECT * FROM Products;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else {
        query1 = `SELECT * FROM Products WHERE product_name LIKE "${req.query.name}%"`
    }
    let query2 = "SELECT * FROM Product_Categories"
    let query3 = "SELECT * FROM Bakeries;";



    // Run the 1st query
    db.pool.query(query1, function (error, rows, fields) {
        let products = rows;

        db.pool.query(query2, (error, rows, fields) => {
            let categories = rows;

            db.pool.query(query3, (error, rows, fields) => {

                let bakeries = rows;

                // Construct an object for reference in the table
                // Array.map is awesome for doing something with each
                // element of an array.
                let bakeriesmap = {}
                bakeries.map(bakery => {
                    let id = parseInt(bakery.bakery_id, 10);
                    bakeriesmap[id] = bakery["name"];
                })

                let categoriesmap = {}
                categories.map(category => {
                    let id = parseInt(category.product_category_id, 10);
                    categoriesmap[id] = category["category_name"];
                })

                products = products.map(product => {
                    return Object.assign(product, { bakery_id: bakeriesmap[product.bakery_id], product_category_id: categoriesmap[product.product_category_id] })
                })

                return res.render('products', { data: products, bakeries: bakeries, categories: categories });
            })
        })
    })
})


app.get('/customers', function (req, res) {
    let query1 = "SELECT * FROM Customers;";

    db.pool.query(query1, function (error, rows, fields) {
        let customers = rows;
        return res.render('customers', { data: customers});
    })
})

app.get('/product_categories', function (req, res) {
    let query1 = "SELECT * FROM Product_Categories;";

    db.pool.query(query1, function (error, rows, fields) {
        let product_categories = rows;
        return res.render('product_categories', { data: product_categories});
    })
})

app.get('/bakeries', function (req, res) {
    let query1 = "SELECT * FROM Bakeries;";

    db.pool.query(query1, function (error, rows, fields) {
        let bakeries = rows;
        return res.render('bakeries', { data: bakeries});
    })
})


app.get('/orders', function (req, res) {
    let query1 = "SELECT * FROM Orders;";

    let query2 = "SELECT * From Bakeries;";

    let query3 = "SELECT * From Customers;";

    db.pool.query(query1, function (error, rows, fields) {
        let orders = rows;

        db.pool.query(query2, function (error, rows, fields) {
            let bakeries = rows;

            db.pool.query(query3, function(error, rows, fields) {
                let customers = rows;
                return res.render('orders', { data: orders, bakeries: bakeries, customers: customers});
            })
        })
    })
})

app.get('/products_has_orders', function (req, res) {
    let query1 = "SELECT * FROM Products_has_Orders;";

    let query2 = "SELECT * FROM Products;";

    let query3 = "SELECT * FROM Orders;";

    db.pool.query(query1, function (error, rows, fields) {
        let orders = rows;

        db.pool.query(query2, function (error, rows, fields) {
            let products = rows;

            db.pool.query(query3, function (error, rows, fields) {
                let orders2= rows;
                return res.render('products_has_orders', { data: orders, products: products, orders2: orders2});
            })
        })
    })
})

// POST ROUTES //

app.post('/add-customer-form', function (req, res) {
    let data = req.body

    let name = data['input-name'];
    let email = data['input-email'];
    let address = data['input-address'];

    let query1 = `INSERT INTO Customers (name, email, address) VALUES ('${name}', '${email}', '${address}')`;
    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.redirect('/customers');
        }
    })
})

app.post('/add-product-category-form', function (req, res) {
    let data = req.body

    let category_name = data['input-category-name'];

    let query1 = `INSERT INTO Product_Categories (category_name) VALUES ('${category_name}')`;

    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.redirect('/product_categories');
        }
    })
})

app.post('/add-bakery-form', function (req, res) {
    let data = req.body

    let name = data['input-name'];
    let email = data['input-email'];
    let address = data['input-address'];

    let query1 = `INSERT INTO Bakeries (name, email, address) VALUES ('${name}', '${email}', '${address}')`;
    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.redirect('/bakeries');
        }
    })
})


app.post('/add-product-form', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let price = parseInt(data['input-price']);
    if (isNaN(price)) {
        price = 0
    }

    let quantity = parseInt(data['input-quantity']);
    if (isNaN(quantity)) {
        quantity = 0
    }

    // Capture null bakery values
    if (data['input-bakery'] === 'none') {
        data['input-bakery'] = null;
    } else {
        data['input-bakery'] = `'${data['input-bakery']}'`;
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Products (product_name, product_price, quantity_in_stock, bakery_id, product_category_id) VALUES ('${data['input-name']}', '${price}', '${quantity}', ${data['input-bakery']}, '${data['input-category']}')`;
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else {
            res.redirect('/products');
        }
    })
})

app.post('/add-order-form', function (req, res) {
    let data = req.body

    let total = data['input-total'];
    let date = data['input-date'];
    //let bakery_id = data['bakery_id'];
    //let customer_id = data['customer_id'];

    let query1 = `INSERT INTO Orders (order_total, order_date, bakery_id, customer_id) VALUES (${total}, '${date}', ${data['input-bakery']}, ${data['input-customer']})`;
    console.log(query1)
    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.redirect('/orders');
        }
    })
})

app.post('/add-order-details-form', function (req, res) {
    let data = req.body

    let quantity = data['input-quantity'];

    let query1 = `INSERT INTO Products_has_Orders (order_id, product_id, quantity) VALUES (${data['input-order-id']}, ${data['input-product']}, ${quantity})`;
    
    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.redirect('/products_has_orders');
        }
    })
})

// DELETE ROUTES //

app.delete('/delete-product-ajax/', function (req, res, next) {
    let data = req.body;
    let product_id = parseInt(data.id);
    let deleteFromProductsHasOrders = `DELETE FROM Products_has_Orders WHERE product_id = ?`;
    let deleteFromProducts = `DELETE FROM Products WHERE product_id = ?`;


    // Run the 1st query
    db.pool.query(deleteFromProductsHasOrders, [product_id], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        else {
            // Run the second query
            db.pool.query(deleteFromProducts, [product_id], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});

// PUT ROUTES //

app.put('/put-product-ajax', function (req, res, next) {
    let data = req.body;

    let product_category_id = parseInt(data.category);
    let product = parseInt(data.name);

    let queryUpdateProduct = `UPDATE Products SET product_category_id = ? WHERE Products.product_id = ?`;
    let selectCategory = `SELECT * FROM Product_Categories WHERE product_category_id = ?`

    // Run the 1st query
    db.pool.query(queryUpdateProduct, [product_category_id, product], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else {
            // Run the second query
            db.pool.query(selectCategory, [product_category_id], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

app.put('/put-product-bakery-ajax', function (req, res, next) {
    let data = req.body;

    let bakery_id = parseInt(data.bakery);
    if (isNaN(bakery_id)) {
        bakery_id = null
    }

    let product = parseInt(data.name);
    

    let queryUpdateProduct = `UPDATE Products SET bakery_id = ? WHERE Products.product_id = ?`;
    let selectBakery = `SELECT * FROM Bakeries WHERE bakery_id = ?`

    // Run the 1st query
    db.pool.query(queryUpdateProduct, [bakery_id, product], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else {
            // Run the second query
            db.pool.query(selectBakery, [bakery_id], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});




/*
    LISTENER
*/
app.listen(PORT, function () {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
