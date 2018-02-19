//Install and require the inquirer npm package to prompt user.
var inquirer = require ("inquirer");

//Install and require the mysql npm package to make connection to mysql database.
var mysql = require ("mysql");

//Read and set any environment variables with the dotenv package.
require("dotenv").config();

//Install and require the cli-table npm package.
//This utility allows you to render unicode-aided tables on the command line from your node.js scripts.
var Table = require('cli-table');

//Create connection to mysql database.
//Read mysql password from the .env file.
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: 'root',
	password: process.env.MYSQL_PASSWORD,
	database: 'bamazon'
});

//Create function to show the menu options that a store supervisor can access.
function showSupervisorScreen() {
	console.log("BAMAZON FOR SUPERVISORS");
	//Create inquirer prompt to display list of available menu options/actions that a supervisor can access.
	//A supervisor can view product sales by department and create a new department.
	var chooseManagerAction = [
	 {
	    type: 'list',
	    name: 'supervisorList',
	    message: "What would you like to do?",
	    choices: ['View Product Sales by Department', 'Create New Department', 'Exit Application'],
	  }
	];

	inquirer.prompt(chooseManagerAction).then(answers => {
		//If supervisor user selects view product sales by department, show table that displays product sales for each department.
		if (answers.supervisorList === "View Product Sales by Department") {
			viewProdSalesByDept();
		}

		//If supervisor user selects create new department, prompt user to enter department name and department overhead costs.
		else if (answers.supervisorList === "Create New Department") {
			createNewDept();
		}

		//If supervisor doesn't want to do anything else and wants to exit, end database connection and exit the application.
		else if (answers.supervisorList === "Exit Application") {
			exitApplication();
		}
	});
}

//Create function so that a supervisor user can view product sales by department in a table.
function viewProdSalesByDept() {
	console.log("Here are the product sales by department.");
	//Create database connection query to join the departments table and products table.
	//Here, we are selecting department id, department name, overhead costs from departments table.
	//We are also selecting the SUM of the product sales from the products table for each department and storing that information using the alias department_sales.
	//We are only selecting DISTINCT department names so that there will be no duplicate values in the joined table.
	//We are doing an INNER JOIN from the departments table where deparment name from departments table equals department name from products table.
	//We are grouping by the department_name column.
	//We are ordering the results by the department_sales column (from highest to lowest);
	var query = "SELECT DISTINCT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) as department_sales FROM departments INNER JOIN products ON (departments.department_name = products.department_name) GROUP BY department_name ORDER BY department_sales desc";
	//console.log(query);
	//Create a connection to the database passing in the created query and callback function as parameters.
	connection.query(query, function(err, res){
		//If there is an error, throw error.
		if(err) throw err;

		//Log the querry results to the terminal.
		//console.log(res);
 
		//Instantiate.
		//Create table to hold the data we get back from the database query.
		var table = new Table({
			//Define names for the header rows.
		    head: ['Department ID', 'Department Name', 'Overhead Costs', 'Department Sales']
		  //, colWidths: [100, 200, 200, 200]
		});
		 
		//Loop through the database query results and push the results to the table and populate table with the department data.
		for (var i=0; i < res.length; i++) {			
			// table is an Array, so you can `push`, `unshift`, `splice` and friends 
			table.push(
		    	[res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].department_sales],
			);
		} 
		//Display table to terminal.
		console.log(table.toString());
		//return to Supervisor Home screen.
		setTimeout(showSupervisorScreen, 3000); 
	});
}

//Create function that allows supervisor user to create a new department in the store.
function createNewDept(){
	//Use inquirer to prompt user to enter the name of the new department and the overhead costs for the department.
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

	//Using the values we get from inquirer, add the new department info to the departments table using INSERT INTO statement.
	inquirer.prompt(addDept).then(answers => {
		var query = connection.query(
			"INSERT INTO departments SET ?", 
			{
				department_name: answers.deptName,
				over_head_costs: answers.deptCosts
			},
			function(err, res) {
				//If there is an error, console.log it.
				if (err){
					console.log("error: " + err);
				}
				//Otherwise, notify user that the new department was successfully added.
				//Note that the department won't show up in the product sales by dept. table until a manager adds a product to this department.
				console.log(answers.deptName + " department was successfully added to the store!");
			}
		)
		//return to Supervisor Home screen.
		setTimeout(showSupervisorScreen, 3000); 
	});
}

//Call showSupervisorScreen function to display supervisor menu options.
showSupervisorScreen();

//Create function that ends database connection and exits application.
function exitApplication() {
	console.log("Good bye!");
	connection.end();
	return;
}