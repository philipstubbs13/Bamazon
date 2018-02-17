//Install and require the inquirer npm package to prompt user.
var inquirer = require ("inquirer");

//Install and require the mysql npm package to make connection to database.
var mysql = require ("mysql");

var figlet = require ('figlet');

//Read and set any environment variables with the dotenv package:
require("dotenv").config();

//Create connection to mysql database.
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: 'root',
	password: process.env.MYSQL_PASSWORD,
	database: 'bamazon'
});

function showStartScreen() {
	// figlet("Bamazon", function(err, data) {
	//     if (err) {
	//         console.log('Something went wrong...');
	//         console.dir(err);
	//         return;
	//     }
	//     console.log(data);
	// });
	console.log("BAMAZON FOR MANAGERS");
	var chooseManagerAction = [
	 {
	    type: 'list',
	    name: 'managerList',
	    message: "What would you like to do?",
	    choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
		default: true
	  }
	];

	inquirer.prompt(chooseManagerAction).then(answers => {
		if (answers.managerList === "View Products for Sale") {
			showProductsForSale();
		}

		else if (answers.managerList === "View Low Inventory") {
			viewLowInventory();
		}

		else if (answers.managerList === "Add to Inventory") {
			console.log("add inventory");
		}

		else if (answers.managerList === "Add New Product") {
			console.log("add new product");
		}
	});
}

function showProductsForSale() {
	connection.query("SELECT * FROM products", function(err, res){
		if(err) throw err;

		console.log("Products for sale")
		for (var i = 0; i < res.length; i++){
			var items = 
			"====================================" + "\r\n" +
			"Item number: " + res[i].item_id + "\r\n" +
			"Item: " + res[i].product_name + "\r\n" +
			"Price: $" + res[i].price + "\r\n" +
			"Department: " + res[i].department_name + "\r\n" +
			"Quantity in stock: " + res[i].stock_quantity + "\r\n" +
			"====================================="
			console.log(items);
		}
		connection.end();
	});
}

function viewLowInventory() {
	connection.query("SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity < 5", function(err,res){
		if (err) throw err;

		console.log("The following products are low in inventory (quantity is less than 5.)");
		//console.log(res);
		for (var i = 0; i < res.length; i++){
			var lowInvetoryItems =
			"====================================" + "\r\n" +
			"Item number: " + res[i].item_id + "\r\n" +
			"Item: " + res[i].product_name + "\r\n" +
			"Quantity in stock: " + res[i].stock_quantity + "\r\n" +
			"====================================" 
			console.log(lowInvetoryItems);
		}
		connection.end();
	})
}
showStartScreen();