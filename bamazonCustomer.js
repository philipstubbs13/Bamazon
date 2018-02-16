//Install and require the inquirer npm package to prompt user.
var inquirer = require ("inquirer");

//Install and require the mysql npm package to make connection to database.
var mysql = require ("mysql");

//Create connection to mysql database.
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: 'root',
	password: 'Fenway#1',
	database: 'bamazon'
});

connection.connect(function(err) {
	if(err) throw err;

	console.log("connected as id " + connection.threadId);
});