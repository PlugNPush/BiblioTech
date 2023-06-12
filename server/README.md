# Install

## MacOS

Link to install mysql for mac : 
http://obscuredclarity.blogspot.com/2009/08/install-mysql-on-mac-os-x.html
In order to initialize the database, type command line : /usr/local/mysql/bin/mysql -u root -p < ./initialisation.sql

## Windows 

Install MySQL Workbench
Install a mysql database server : https://dev.mysql.com/downloads/mysql/
Create a connection in MySQL Workbench and then execute the file initialisation.sql

# Set up environment 

Create a file .data_db.js in the folder setup/routes/
With the following content : 
```js
const data_db = {
    database : "db_master_project",
    username : "",
    password : "",
    port : "3306"
}

module.exports = data_db;
```
Add your MySQL username and password