//Install and require the inquirer npm package to prompt user.
var inquirer = require ("inquirer");

//Install and require the mysql npm package to make connection to database.
var mysql = require ("mysql");

//Read and set any environment variables with the dotenv package:
require("dotenv").config();

//Install and require the cli-table npm package.
//This utility allows you to render unicode-aided tables on the command line from your node.js scripts.
var Table = require('cli-table');

//Create connection to mysql database.
//Read mysql password from the .env file, which doesn't get uploaded to github.
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: 'root',
	password: process.env.MYSQL_PASSWORD,
	database: 'bamazon'
});

//Create function that allows users with manager permissions to view certain menu options.
function showManagerScreen() {
	console.log("BAMAZON FOR MANAGERS");
	//A manager user can view products for sale, view low inventory, add to inventory, and add a new product.
	var chooseManagerAction = [
	 {
	    type: 'list',
	    name: 'managerList',
	    message: "What would you like to do?",
	    choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
		default: true
	  }
	];

	//Use inquirer to prompt user to select an action from the list.
	inquirer.prompt(chooseManagerAction).then(answers => {
		//If user selects view products for sale, show the products that are currently for sale.
		if (answers.managerList === "View Products for Sale") {
			showProductsForSale();
		}

		//If user selects view low inventory, show the products that have a stock of less than 5.
		else if (answers.managerList === "View Low Inventory") {
			viewLowInventory();
		}

		//If user selects add to inventory, allow user to add stock to product.
		else if (answers.managerList === "Add to Inventory") {
			addToInventory();
		}

		//If user selects add new product, allow user to add a new product to the store.
		else if (answers.managerList === "Add New Product") {
			addNewProduct();
		}
	});
}

//Create function to show all the products currently for sale.
function showProductsForSale() {
	//Create connection query and query all the columns from the products table.
	connection.query("SELECT * FROM products", function(err, res){
		if(err) throw err;

		//Display the product information to the terminal, including the quantity in stock.
		console.log("Products for sale")
		//Instantiate.
		//Create table to hold the data we get back from the database query.
		var productsForSaleTable = new Table({
			//Define names for the header rows.
		    head: ['Item number', 'Item', 'Price', 'Deparment', 'Quantity in stock']
		  //, colWidths: [100, 200, 200, 200]
		});
		 
		//Loop through the database query results and push the results to the table and populate table with the product data.
		for (var i=0; i < res.length; i++) {			
			// table is an Array, so you can `push`, `unshift`, `splice` and friends 
			productsForSaleTable.push(
		    	[res[i].item_id, res[i].product_name, res[i].price, res[i].department_name, res[i].stock_quantity],
			);
		} 
		//Display table to terminal.
		console.log(productsForSaleTable.toString());
		//End database connection.
		connection.end();
	});
}

//Create a function to view products that have a stock of less than 5.
function viewLowInventory() {
	//Create a connection query and query the database for products that have a stock_quantity less than 5.
	connection.query("SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity < 5", function(err,res){
		//If there is an error, throw error.
		if (err) throw err;

		//Display the products with stock_quantity < 5 to terminal.
		console.log("Products low in inventory (quantity is less than 5)");
		//console.log(res);
		//Instantiate.
		//Create table to hold the data we get back from the database query.
		var lowInventoryTable = new Table({
			//Define names for the header rows.
		    head: ['Item number', 'Item','Quantity in stock']
			//, colWidths: [100, 200, 200, 200]
		});
		 
		//Loop through the database query results and push the results to the table and populate table with the product data.
		for (var i=0; i < res.length; i++) {			
			// table is an Array, so you can `push`, `unshift`, `splice` and friends 
			lowInventoryTable.push(
		    	[res[i].item_id, res[i].product_name, res[i].stock_quantity],
			);
		} 
		//Display table to terminal.
		console.log(lowInventoryTable.toString());
		//End database connection.
		connection.end();
	})
}

//Create a function that allows manager user to add a new product to the store.
function addNewProduct(){
	//Create connection query to the database to query all the department names available in the database.
	connection.query("SELECT DISTINCT department_name FROM products", function(err, res){
		//If there is an error, throw error.
		if(err) throw err;
		//Use inquirer to prompt user for the new product information (product name, department, price, and quantity in stock).
		//console.log(res);
		var addProduct = [
		 {
		 	type: 'text',
		 	name: 'productName',
		 	message: 'What is the product name? This is the name that will be visible to customers.'
		 },
		 {
		 	type: 'list',
		 	name: 'productDepartment',
		 	message: 'What department does this product belong to?',
		 	choices: function() {
		 		var departmentsArray = [];
		 		for (var i = 0; i < res.length; i++) {
		 			departmentsArray.push(res[i].department_name);
		 		}
		 		return departmentsArray;
		 	}

		 },
		 {
		 	type: 'text',
		 	name: 'productPrice',
		 	message: 'What is the price of the product?'
		 },
		 {
		 	type: 'text',
		 	name: 'productStock',
		 	message: 'How many are currently in stock?',
		 	validate: function(value) {
		        if (isNaN(value) === false) {
		        	return true;
		        }
		        return false;
		    }
		 },
		];


		//After getting product information from user run INSERT INTO statement to add product to mysql database.
		inquirer.prompt(addProduct).then(answers => {
			var query = connection.query(
				"INSERT INTO products SET ?", 
				{
					product_name: answers.productName,
					department_name: answers.productDepartment,
					price: answers.productPrice,
					stock_quantity: answers.productStock,
					product_sales: 0

				},
				function(err, res) {
					//If there is an error, log it.
					if (err){
						console.log("error: " + err);
					}
					//Else, notify user that the product was successfully added to the store.
					console.log(answers.productName + " was successfully added to the store!");
				}
			)
			//End database connection.
			connection.end();
		});
	});
}

//Create a function that allows manager users to add stock to a product.
function addToInventory(){
	//Use inquirer to prompt user to enter the item number and how much stock they want to add.
	var addInventory = [
	 {
	 	type: 'text',
	 	name: 'itemNumber',
	 	message: 'For which product do you want to add more stock? Enter item number: ',
	 	validate: function(value) {
	        if (isNaN(value) === false) {
	        	return true;
	        }
	        return false;
	    }
	 },
	 {
	 	type: 'text',
	 	name: 'howMuchStock',
	 	message: 'How many do you want to add?',
	 	validate: function(value) {
	        if (isNaN(value) === false) {
	        	return true;
	        }
	        return false;
	    }
	 },

	];

	//After getting information from user, create connection query to the database.
	inquirer.prompt(addInventory).then(answers => {
		//Run UPDATE statement on products table to update stock quantity for the item number the user entered.
		var query = connection.query("UPDATE products SET ? WHERE ?",
			[
				{
					stock_quantity: answers.howMuchStock,
				},
				{
					item_id: answers.itemNumber
				}
			],
			function(err, res) {
				//After adding product stock, notify user that the stock quantity has been updated in the database.
				console.log("Stock quantity updated for item number: " + answers.itemNumber);
				console.log("Updated quantity: " + answers.howMuchStock);
			}
		)
	});
}

//Call showManagerScreen function to display manager menu options.
showManagerScreen();