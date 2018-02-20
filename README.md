# Bamazon Sporting Goods

## Table of contents
  * [Demo](#demo)
  * [About this project](#about-this-project)
  * [Getting started](#contribute)
  * [App workflow](#app-workflow)
  * [Technologies used to create app](#technologies-used)
  * [Future code development](#feature-enhancements)
  * [Issues](#issues)

## <a name="demo"></a> Demo
Video demo: 

## <a name="about-this-project"></a> About this project
This project is a command line application built using Node.js, Javascript, the inquirer npm package, and a MySQL database. It is an Amazon-like storefront (hence, the name Bamazon) that takes in customer orders on various sporting goods and outdoor items through the Bamazon Customer Portal. When a customer order is taken in the Customer Portal, the stock quantity for the product that is being purchased decreases by how much of that product the customer decides to buy. 

Managers can also use this application through the Bamazon Manager Portal. In the Bamazon Manager Portal, managers can see all the products that are currently being sold in the store, see all products that are low in inventory (that is, stock quantity is less than 5), add inventory to an existing product, and add a new product to the store.

Finally, the Bamazon Supervisor Portal allows store supervisors to track product sales across departments as well as see a summary of the highest-grossing departments in the store. From this portal, supervisors also are able to create a new department if desired.

## <a name="contribute"></a> Getting started
To set up this application on your own computer, perform the following steps:
  1. [Clone the repository](#clone-repository)
  2. [Install Node.js](#install-node)
  3. [Install MySQL Workbench](#install-mysql)
  3. [Install the dependencies](#dependencies)
  4. [Set up database](#database-setup)
  5. [Create a .env file to store MySQL Password](#create-env)

### <a name="clone-repository"></a> Clone the repository
The first step is to clone the project repository to a local directory on your computer. To clone the repository, run the following commands:
<pre>
  git clone https://github.com/philipstubbs13/Bamazon.git
  cd Bamazon
</pre>

### <a name="install-node"></a> Install Node.js
<p>If you don't already have Node.js installed on your computer, you can install the latest version here: https://nodejs.org/en/.</p>

### <a anem="install-mysql"></a> Install MySQL Workbench
<p>If you don't already have MySQL Workbench installed on your computer, you can install the latest version here: https://www.mysql.com/products/workbench/</p>
<p>For this project, MySQL Workbench is used to visually design, create, and manage the database used to store product and department data.</p>

#### <a name="structure-of-project"></a> Structure of the project
<p>After you clone the repository, navigate to the project root directory (Bamazon). The project directory structure is set up as follows:</p>
<ul>
  <li> 
  	<p><b>BamazonCustomer.js</b>: Bamazon Customer Portal Node Application. Running this application displays information for all of the items on sale, including item number, product name, department name, and the price of the product for sale.</p>
  	<p>When customer order is processed, stock quantity and product sales are updated in the database, and the amount that the customer's account is charged is displayed on the screen.</p>
  </li>
  <li>
  	<p><b>BamazonManager.js</b>: Bamazon Manager Portal Node Application. Running this application displays a list of menu options that store managers can choose from. This application allows managers to view all the products for sale, view products that are low in inventory, add inventory, and add a new product to the store. </p>
  </li>
  <li>
  	<p><b>BamazonSupervisor.js</b>: Bamazon Supervisor Portal Node Application. Runing this application displays a list of menu options that store supervisors can choose from. This application allows supervisors to add a new department to the store by providing information through a series of inquirer prompts.</p>
  	<p>This application also allows supervisors to see a summary (in table format) of product sales by department. Total profit is also displayed in the same table. Total profit is equal to department product sales minus department overhead costs). Note that total profit is calculated on the fly and is stored outside of the database.</p>
  </li>
  <li>
  	<p><b>schema.sql</b>: The database schema (that is, how objects are grouped in the database). For this project, the database includes two tables, a products table and a departments table.</p>
  	<ul>
  		<li>The products table contains information about each product that is sold in the store, including item number/id, product name, department name, price, stock quantity, and product sales.</li>
  		<li> The departments table contains information about each department in the store, including deparment number, department name, and overhead costs.</li>
  	</ul>
  	<p>In the Supervisor Portal, the products table and departments table are joined to calculate product sales and total profits for each department.</p>
  </li>
  <li><b>package.json</b>: Lists the project dependencies (third party npm packages) and their version numbers.</li>
  <li><b>.gitignore</b>: Any file or directory listed inside this file will not be tracked by GitHub when code is committed.</li>
  <li><b>package-lock.json</b>: Dependency tree for the project. Lists all the dependencies and their versions.</li>
</ul>

### <a name="dependencies"></a> Install the dependencies
<p>The following npm packages are dependencies to the project. You must install these packages in the project root directory (Bamazon) to be able to use this application from the command line.</p>
<p>After you clone the repository to a local directory, change directory to the project root directory (Bamazon) and run the following command to install the required npm packages:</p>
<pre>npm install</pre>
<ul>
	<li>inquirer npm package (https://www.npmjs.com/package/twitter) - used to prompt customers when purchasing a product, managers when adding inventory or adding a new product, and supervisors when adding a new department. </li>
	<li>cli-color npm package (https://www.npmjs.com/package/cli-color) - used to add color to the application.</li>
  	<li>mysql npm package (https://www.npmjs.com/package/mysql) - used to create a connection to the MySQL database.</li>
  	<li>cli-table npm package (https://www.npmjs.com/package/cli-table) - used to render tables on the command line from node.js scripts.</li>
  	<li>dotenv npm package (https://www.npmjs.com/package/dotenv) - used to retrieve the MySQL password from a .env file</li>
</ul>
<p>Version information for each of these packages is available in the package.json file in the project root directory.</p>

## <a name="database-seutp"></a> Set up database

## <a name="create-env"></a> Create a .env file to store MySQL Password
To connect to the MySQL database, you need to provide your own .env file.

Create a file named .env in the project root directory (Bamazon) with the following contents. Replace <i>mysql_password</i> with your actual MySQL password.

<pre>
# MySQL Password

MYSQL_PASSWORD='<i>mysql_password</i>'
</pre>

This file will be used by the dotenv npm package, which will pass the password value as an environment variable to the global process.env object in node. Because .env is specified in the .gitignore file, the MySQL password won't be pushed to GitHub — keeping the password information private.


## <a name="app-workflow"></a> App workflow


## <a name="technologies-used"></a> Technologies used to build app

  * Node.js (https://nodejs.org/en/)
  * Javascript 
  * MySQL (https://www.mysql.com/)

## <a name="feature-enhancements"></a> Future code development
<p>Source code will be developed over time to handle new features.</p>
<p>The following is a list of potential feature enhancements:</p>
<ul>
	<li>Create a mySQL login system that prompts users for a username and password.</li>
	<li>Add option to Manager Portal to remove product from store.</li>
	<li>Add option to Supervisor Portal to remove department from store.</li>	
</ul>

## <a name ="Issues"></a> Issues
<p>If you find an issue while using the app or have a request, <a href="https://github.com/philipstubbs13/Bamazon/issues/" target="_blank">log the issue or request here</a>. These issues will be addressed in a future code update.</p>