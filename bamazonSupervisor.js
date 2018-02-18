//Install and require the inquirer npm package to prompt user.
var inquirer = require ("inquirer");

//Install and require the mysql npm package to make connection to database.
var mysql = require ("mysql");

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
	console.log("BAMAZON FOR SUPERVISORS");
	var chooseManagerAction = [
	 {
	    type: 'list',
	    name: 'supervisorList',
	    message: "What would you like to do?",
	    choices: ['View Product Sales by Department', 'Create New Department'],
	  }
	];

	inquirer.prompt(chooseManagerAction).then(answers => {
		if (answers.supervisorList === "View Product Sales by Department") {
			viewProdSalesByDept();
		}

		else if (answers.supervisorList === "Create New Department") {
			createNewDept();
		}
	});
}

function createNewDept(){
	var addDept = [
	 {
	 	type: 'text',
	 	name: 'deptName',
	 	message: 'What is the name of the department you want to add?'
	 },
	 {
	 	type: 'text',
	 	name: 'deptCosts',
	 	message: 'What are the overhead costs for this department?',
	 	validate: function(value) {
	        if (isNaN(value) === false) {
	        	return true;
	        }
	        return false;
	    }
	 }
	];

	inquirer.prompt(addDept).then(answers => {
		var query = connection.query(
			"INSERT INTO departments SET ?", 
			{
				department_name: answers.deptName,
				over_head_costs: answers.deptCosts
			},
			function(err, res) {
				if (err){
					console.log("error: " + err);
				}
				console.log(answers.deptName + " was successfully added to the store!");
			}
		)
		connection.end();
	});
}

showStartScreen();