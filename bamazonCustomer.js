//Install and require the inquirer npm package to prompt user.
var inquirer = require ("inquirer");

//Install and require the mysql npm package to make connection to mysql database.
var mysql = require ("mysql");

//Read and set any environment variables with the dotenv package:
require("dotenv").config();

//Create connection to mysql database.
//Read mysql password from .env file, which doesn't get uploaded to github.
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: 'root',
	password: process.env.MYSQL_PASSWORD,
	database: 'bamazon'
});

//Create function that allows users to browse and purchase items from store.
function showCustomerScreen() {
	console.log("Welcome to Bamazon Sporting Goods!");
	//Use inquirer to prompt user if they would like to see the items on sale today.
	var saleItems = [
	 {
	    type: 'confirm',
	    name: 'seeSaleItems',
	    message: 'Would you like to see what we have on sale today? ',
		default: true
	  }
	];

	inquirer.prompt(saleItems).then(answers => {
		//If the user confirms and wants to see sale items...
		if (answers.seeSaleItems) {
			//then show list of sale items and their prices.
			showItemsForSale();
		}

		//If user decides that they really don't want to shop right now...
		else {
			//Then, exit application.
			console.log("Thanks for shopping with us! Have a nice day!");
			connection.end();
			return;
		}
	});
}

//Create function that allows customers to see all the different products for sale and their prices.
function showItemsForSale() {
	//Create a connection query to the database.
	//Select all columns from products table to get product info.
	connection.query("SELECT * FROM products", function(err, res){
		//If there is an error, throw error.
		if(err) throw err;

		//Use inquirer to prompt customer to select a department
		//console.log(res);
		var chooseDepartment = [
			{
			 	type: 'list',
			 	name: 'productDepartment',
			 	message: 'Select a department',
			 	choices: function() {
			 		var departmentsArray = [];
			 		for (var i = 0; i < res.length; i++) {
			 			departmentsArray.push(res[i].department_name);
			 		}
			 		return departmentsArray;
			 	}
			}
		];
		//After customer selects department.
		inquirer.prompt(chooseDepartment).then(answers => {
			var customerDept = answers.productDepartment;
			//Search the database for only the items in the department that the customer selected.
			connection.query("SELECT * from products WHERE ?", 
				{
					department_name: customerDept
				},
				function(err, res) {
					if (err){
						console.log("error: " + err);
					}
					//console.log(res);
						//Show only the items in the department that the customer selected.
						console.log("Items for sale");
						console.log("Department: " + customerDept);
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
					//After customer has a chance to look over the items, ask them if they want to buy something today.
					buyItemOrLeave();
				}
			);
		});
	});
}

//Create function that allows customers to buy something from the store.
function buyItemOrLeave() {
	//Use inquire to ask customers if they want to buy something from the list.
	var buyItem = [
	 {
	    type: 'confirm',
	    name: 'readyToBuy',
	    message: 'Do you want to buy something today?',
	    default: true
	  }
	];

	inquirer.prompt(buyItem).then(answers => {
		//If customer confirms that they want to buy something...
		//Then, use inquirer to prompt them for the item number of the product they want to buy.
		if (answers.readyToBuy){
			console.log("What would you like to buy?");
			console.log("Enter the item nuber of the item that you would like to buy.");
			selectItem();
		}

		else {
			//If the user decides they don't want to buy anything, exit application.
			console.log("Thanks for shopping with us! Come back soon for more deals.");
			//End database connection.
			connection.end();
			return;
		}
	});
}

//Create function that allows customers to select the product they want to purchase and a quantity value.
function selectItem() {
	//Create a connection query to the database.
	//Select all columns from the products table to get product info.
	connection.query("SELECT * FROM products", function(err, res){
		//If there is an error, throw error.
		if(err) throw err;

		//To make purchase and checkout, go through series of prompts using inquirer.
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
			//If customer confirms order...
			if (answers.confirmOrder) {
				//console.log(res);
				//console.log("User entered: " + answers.itemNumber);
				var customerItem;
				var availableItemNumbers = [];
				for (var i = 0; i < res.length; i++){
					availableItemNumbers.push(res[i].item_id);
					if (res[i].item_id === parseInt(answers.itemNumber)) {
				 		customerItem = res[i];
				 	}
				 }
				 //console.log(availableItemNumbers);
				//console.log(customerItem);

				//If item number that user entered is invalid (does not exist in availableItemNumbers array),
				//Then, display error message that item number is not valid and return to Customer Home Screen.
				if (availableItemNumbers.indexOf(parseInt(answers.itemNumber)) === -1) {
					var invalidItemNumberError = 
					"==========================================================================================================" + "\r\n" +
					"Item number " + answers.itemNumber +  " was not found." + "\r\n" +
					"Enter valid item number and try again." + "\r\n" +
					"=========================================================================================================="
					console.log(invalidItemNumberError);
					//Return to Customer Home screen.
					setTimeout(showItemsForSale, 3000);
				}

				//If stock quantity is less than the quantity that the customer wants, 
				//notify customer that store doesn't have enough in stock right now.
				else if (customerItem.stock_quantity < answers.howMany) {
				 	console.log("Sorry, we only have " + customerItem.stock_quantity + " left on stock right now.");
				 	console.log("Select a different amount or choose another item.");
				 	//Return to Customer Home screen.
				 	setTimeout(showItemsForSale, 2000);

				}

				//If the item number that the user entered is valid (exists in the availableItemNumbers array)
				//AND
				//If there is enough in stock right now, place order and charge customer for purchase.
				else if (availableItemNumbers.indexOf(parseInt(answers.itemNumber)) > -1 && customerItem.stock_quantity > answers.howMany) {
						//Create variable that we can use to update product stock quantity in database.
						//Stock quantity equals current stock minus quantity customer purchased.
						var newQuantity = customerItem.stock_quantity - answers.howMany;
						//console.log("Updating quantity... \n" + newQuantity);
						//Create variable to calculate how much to charge customer.
						var customerTotal = customerItem.price * answers.howMany;
						//Create variable to update/calculate productSalesTotal based on customerTotal.
						var productSalesTotal = customerItem.product_sales + customerTotal;

						//Create connection query to database. 
						//Run UPDATE statement on products table to update product stock quantity in database for the specified item number.
						var query = connection.query(
							"UPDATE products SET ? WHERE ?",
							[
								{
									stock_quantity: newQuantity,
									product_sales: productSalesTotal
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
						//Display order details and total price to customer.
						console.log("Order complete");
						console.log("Item ordered: " + customerItem.product_name);
						console.log("Quantity: " + answers.howMany);
						console.log("Your total is $" + customerTotal + ".");
						continueShopping();
				}
			}

			//If customer cancels order....
			else {
				console.log("Thanks for shopping with us. Have a nice day!");
			}
		});
	});
	;
}

//Create function to ask customer if they want to continue shopping after an order is placed.
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
		//If customer wants to continue to show, show list of items for sale again.
		if (answers.continueToShop) {
			showItemsForSale();
		}

		else {
			//Otherwise, exit application.
			console.log("Good bye! Have a nice day!");
			connection.end();
			return;
		}
	});

}
//Call function to display customer start screen.
showCustomerScreen();