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

//Test connection to the database.
// connection.connect(function(err) {
// 	if(err) throw err;

// 	console.log("connected as id " + connection.threadId);
// });

function showItemsForSale() {
	connection.query("SELECT * FROM products", function(err, res){
		if(err) throw err;

		console.log("Items for sale")
		for (var i = 0; i < res.length; i++){
			var items = 
			"====================================" + "\r\n" +
			"Item number: " + res[i].item_id + "\r\n" +
			"Item: " + res[i].product_name + "\r\n" +
			"Price: $" + res[i].price + "\r\n" +
			"Department: " + res[i].department_name + "\r\n" +
			("=====================================")
			console.log(items);
		}
		connection.end();
		buyItemOrLeave();
	});
}

function buyItemOrLeave() {
	var buyItem = [
	 {
	    type: 'confirm',
	    name: 'readyToBuy',
	    message: 'Do you want to buy something today?',
	    default: true
	  }
	];

	inquirer.prompt(buyItem).then(answers => {
		//If the user confirms that they want to buy something...
		if (answers.readyToBuy){
			console.log("Great! Welcome to Bamazon Sporting Goods! What would you like to buy?");
			console.log("Enter the item nuber of the item that you would like to buy.");
		}

		else {
			//If the user decides they don't want to buy anything, exit application.
			console.log("Good bye! Come back soon for more deals.");
			return;
		}
	});
}

showItemsForSale();