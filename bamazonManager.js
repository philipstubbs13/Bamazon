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
			console.log("view products");
		}

		else if (answers.managerList === "View Low Inventory") {
			console.log("view low inventory");
		}

		else if (answers.managerList === "Add to Inventory") {
			console.log("add inventory");
		}

		else if (answers.managerList === "Add New Product") {
			console.log("add new product");
		}
	});
}

showStartScreen();