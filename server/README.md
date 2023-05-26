# Install

## MacOS

Link to install mysql for mac : 
http://obscuredclarity.blogspot.com/2009/08/install-mysql-on-mac-os-x.html
In order to initialize the database, type command line : /usr/local/mysql/bin/mysql -u root -p < ./initialisation.sql

## Windows 

Installer mysql workbench
Installer un mysql database server : https://dev.mysql.com/downloads/mysql/

# Set up environment 

Create a file data_base.js in the folder setup/routes/
With the following content : 
const data_db = {
    database : "db_master_project",
    username : "",
    password : "",
    port : "3306"
}

module.exports = data_db;