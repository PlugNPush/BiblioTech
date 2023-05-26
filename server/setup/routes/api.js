const express = require("express");
const router = express.Router();

const data_db = require('./.data_db.js');

const { Sequelize, DataTypes } = require("sequelize");
const { status } = require("express/lib/response");

const bcrypt = require('bcrypt');

const sequelize = new Sequelize(
  data_db.database,
  data_db.username,
  data_db.password,
  {
    dialect: "mysql",
    host: "localhost",
    port: data_db.port,
  }
);

try {
  sequelize.authenticate();
  console.log("Connected to MySql database!");
} catch (error) {
  console.error("Unable to connect", error);
}

router.use((req, res, next) => {
  next();
});

const Book = sequelize.define('Book', {
  title: DataTypes.STRING,
  owner: DataTypes.STRING,
  author: DataTypes.STRING,
  year: DataTypes.STRING,
  type: DataTypes.STRING,
  iban: DataTypes.STRING,
  nbBooks: DataTypes.INTEGER,
  publisher: DataTypes.STRING,
  price_old: DataTypes.STRING,
  price_new: DataTypes.STRING,
}, {
  // Other model options go here
});

router.post("/addBook", async (req, res) => {
  const { title, owner, author, year, type, iban, publisher} = req.body;
  try {
    const result = await sequelize.query(
      `INSERT INTO book (title, owner, author, year, type, iban, publisher) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      {
        replacements: [title, owner, author, year, type, iban, publisher],
        type: Sequelize.QueryTypes.INSERT
      }
    );
    res.status(200).json({ message: "Book added successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.get("/getBooksFromOwner/:owner", async (req, res) => {
  const { owner } = req.params;
  try {
    const books = await sequelize.query(
      `SELECT * FROM book WHERE owner = ?`,
      {
        replacements: [owner],
        type: Sequelize.QueryTypes.SELECT
      }
    );
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await sequelize.query(
    `SELECT * FROM user WHERE email = '${email}'`
  );
  
  if (user[0].length === 0) {
    res.status(400).json({ message: "User not found" });
  } else {
    const validPassword = await bcrypt.compare(password, user[0][0].password);

    if (validPassword) {
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(400).json({ message: "Invalid password" });
    }
  }
});

router.post("/signin", async(req, res) => {
    const {username, email, password} = req.body;
    const query = await sequelize.query(
        `Select * from user where email = '${email}';`
    )
    if(query[0].length !== 0) {
        res.status(401).json({message: "email deja present"})
    }
    await sequelize.query( `insert into user (username, email, password) values ('${username}', '${email}', '${password}')`)
    res.status(200).json({message:"Values inserted"})
})

module.exports = router;
