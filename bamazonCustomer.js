var mysql = require('mysql');
var inquirer = require('inquirer');
// sets connection param for database connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    // sets username
    user: "root",
    // sets password
    password: "Hetal@123",
    // sets current database
    database: "bamazon_db"
});
// makes connection with the server
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    items_sale();
});
function items_sale() {
    var item_ids = [];
    connection.query("select * from products where price > 0;", function (err, result) {

        for (var i = 0; i < result.length; i++) {
            item_ids.push(result[i].item_id);
            console.log("-------------");
            console.log("Item Id-->" + result[i].item_id);
            console.log("Item Name-->" + result[i].product_name);
            console.log("Item Price-->" + result[i].price);
            console.log("Department-->" + result[i].department_name);
            console.log("-------------");

        }
        purchase_item(item_ids);
    });


}
function purchase_item(id_list) {
    inquirer.
        prompt([{
            name: "buy",
            type: "list",
            message: "Please select which item would you like to purchase?",
            choices: id_list

        },
        {
            name: "quantity",
            type: "input",
            message: "Please enter quantity?"
        }]).then(function (answers) {
            var qry = "select item_id,stock_quantity,price from products where ?";
            connection.query(qry, { item_id: answers.buy }, function (err, result) {
                var input_qty = answers.quantity;
                check_stock(result[0].stock_quantity, input_qty, result[0].price, result[0].item_id);
            });
        })
}
function check_stock(real_stock, buy_qty, price, item_id) {
    if (real_stock > buy_qty) {
        var total = price * buy_qty;
        console.log("Your total amount is " + total + ".\nThank you for purchasing with BAMAZON!");
        update_qty(buy_qty, item_id);
    }
    else {
        console.log("Insufficient quantity on stock!\nWe only have " + real_stock + " in stock.");
        connection.end();
    }
}
function update_qty(buy_qty, item_id) {
    var qry = "update products set stock_quantity = stock_quantity - ? WHERE ?";
    connection.query(qry,
        [
            buy_qty,
            {
                item_id: item_id
            }
        ], function (err) {
            if (err)
                throw err;
            console.log("Database was updated succefully!");
            connection.end();
        });
}