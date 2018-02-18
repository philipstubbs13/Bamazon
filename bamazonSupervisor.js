//Install and require the inquirer npm package to prompt user.
var inquirer = require ("inquirer");

//Install and require the mysql npm package to make connection to database.
var mysql = require ("mysql");

//Read and set any environment variables with the dotenv package:
require("dotenv").config();

var tableize = require('tableize-object');

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

function viewProdSalesByDept() {
	console.log("Here are the product sales by department.");
	var query = "SELECT DISTINCT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales" +
	" FROM departments INNER JOIN products ON (departments.department_name = products.department_name)";
	//console.log(query);
	connection.query(query, function(err, res){
		if(err) throw err;

		//console.log(res);
 
		// instantiate 
		var table = new Table({
		    head: ['Department ID', 'Department Name', 'Overhead Costs', 'Product Sales']
		  //, colWidths: [100, 200, 200, 200]
		});
		 
		for (var i=0; i < res.length; i++) {

				
		// table is an Array, so you can `push`, `unshift`, `splice` and friends 
		table.push(
		    [res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales],
		  //, ['2', 'Team Sports', 19300, 75000]
		);
		}
		 
		console.log(table.toString());
		// console.log("myPlaylist");
		// for (var i = 0; i < res.length; i++){
		// 	console.log("====================================");
		// 	var myplaylist = 

		// 	"Song #" + res[i].id + "\r\n" +
		// 	"Title: " + res[i].title + "\r\n" +
		// 	"Artist: " + res[i].artist + "\r\n" +
		// 	"Genre: " + res[i].genre 

		// 	console.log(myplaylist);
		// 	console.log("=====================================");

		// }
		connection.end();
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