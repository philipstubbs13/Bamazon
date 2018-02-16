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
	});

// 	var bidOnItem = [
// 	 {
// 	 	type: 'list',
// 	 	name: 'item',
// 	 	message: 'What item would you like to bid on?',
// 	 	choices: function() {
// 	 		itemsArray = [];
// 	 		for (var i = 0; i < res.length; i++) {
// 	 			itemsArray.push(res[i].item);
// 	 		}
// 	 		return itemsArray;
// 	 	}
// 	 },
// 	 {
// 	 	type: 'text',
// 	 	name: 'startBid',
// 	 	message: 'What would you like bid?'
// 	 },
// 	];

// 	inquirer.prompt(bidOnItem).then(answers => {
// 		var biddingItem;
// 		for (var i = 0; i < res.length; i++){
// 			if (res[i].item === answers.item) {
// 				biddingItem = res[i];
// 			}
// 		}
// 		//console.log(biddingItem);

// 		if (biddingItem.startingBid < answers.startBid) {
		

// 			var query = connection.query(
// 				"UPDATE biditems SET ? WHERE ?",
// 			[
// 			{
// 				startingBid: answers.startBid,
// 			},
// 			{
// 				id: biddingItem.id
// 			}

// 		],
// 		function(err, res) {
// 			//console.log(res.affectedRows + " item updated!\n");
// 			console.log("Bid submitted successfully. You are currently the highest bidder.  \n");
// 			postOrBid();
// 		}
// 	);
// 		}

// 		else {
// 			console.log("Your bid was too low.");
// 			postOrBid();
// 		}
// 	});
// });
}

showItemsForSale();