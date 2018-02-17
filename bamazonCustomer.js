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
	console.log("Welcome to Bamazon Sporting Goods!");
	var saleItems = [
	 {
	    type: 'confirm',
	    name: 'seeSaleItems',
	    message: 'Would you like to see what we have on sale today? ',
		default: true
	  }
	];

	inquirer.prompt(saleItems).then(answers => {
		if (answers.seeSaleItems) {
			showItemsForSale();
		}

		else {
			console.log("Thanks for shopping with us! Have a nice day!");
			return;
		}
	});
}

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
			console.log("What would you like to buy?");
			console.log("Enter the item nuber of the item that you would like to buy.");
			selectItem();
		}

		else {
			//If the user decides they don't want to buy anything, exit application.
			console.log("Thanks for shopping with us! Come back soon for more deals.");
			//connection.end();
			return;
		}
	});
}

function selectItem() {
	connection.query("SELECT * FROM products", function(err, res){
		if(err) throw err;

		var selectItem = [
		 {
		    type: 'text',
		    name: 'itemNumber',
		    message: 'Enter item number: ',
		    validate: function(value) {
	          if (isNaN(value) === false) {
	            return true;
	          }
	          return false;
	        }

		  },
		  {
		    type: 'text',
		    name: 'howMany',
		    message: 'How many would you like to buy?',
		    validate: function(value) {
	          if (isNaN(value) === false) {
	            return true;
	          }
	          return false;
	      	}
	        },

	       {
	       	type: 'confirm',
	       	name: 'confirmOrder',
	       	message: "Are you sure? Enter Y to confirm and complete order. Enter N to cancel.",
	       	default: true
	       }
		];

		inquirer.prompt(selectItem).then(answers => {
			if (answers.confirmOrder) {
				//console.log(res);
				//console.log("User entered: " + answers.itemNumber);
				var customerItem;
				for (var i = 0; i < res.length; i++){
				if (res[i].item_id === parseInt(answers.itemNumber)) {
				 		customerItem = res[i];
				 	}
				 }
				//console.log(customerItem);

				if (customerItem.stock_quantity < answers.howMany) {
				 	console.log("Sorry, we only have " + customerItem.stock_quantity + " left on stock right now.");
				}

				else if (customerItem.stock_quantity > answers.howMany) {
						var newQuantity = customerItem.stock_quantity - answers.howMany;
						//console.log("Updating quantity... \n" + newQuantity);

						var query = connection.query(
							"UPDATE products SET ? WHERE ?",
							[
								{
									stock_quantity: newQuantity,
								},
								{
									item_id: customerItem.item_id
								}
							],
							function(err, res) {
								//console.log("Item id: " + customerItem.item_id);
								//console.log("quantity: " + newQuantity);
							}
						)
						console.log("Order complete");
						console.log("Item ordered: " + customerItem.product_name);
						console.log("Quantity: " + answers.howMany);
						console.log("Your total is $" + (customerItem.price * answers.howMany) + ".");
						continueShopping();
				}
			}

			else {
				console.log("Thanks for shopping with us. Have a nice day!");
			}
		});
	});
	;
}

function continueShopping(){
	var purchaseAnotherItem = [
	 {
	    type: 'confirm',
	    name: 'continueToShop',
	    message: 'Do you want to continue shopping? ',
		default: true
	  }
	];

	inquirer.prompt(purchaseAnotherItem).then(answers => {
		if (answers.continueToShop) {
			showItemsForSale();
		}

		else {
			console.log("Good bye! Have a nice day!");
			connection.end();
			return;
		}
	});

}

showStartScreen();