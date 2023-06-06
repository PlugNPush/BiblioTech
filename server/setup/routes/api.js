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
  nbBooks: DataTypes.INTEGER,
  publisher: DataTypes.STRING,
  price_old: DataTypes.STRING,
  price_new: DataTypes.STRING,
}, {
  // Other model options go here
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await sequelize.query(
    `SELECT * FROM user WHERE email = '${email}'`
  );
  
  if (user[0].length === 0) {
    res.status(400).json({ message: "User not found" });
    return
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
    const {firstname, lastname, email, password} = req.body;
    const query = await sequelize.query(
        `Select * from user where email = '${email}';`
    )
    if(query[0].length != 0) {
      res.status(400).json({message: "email deja present"})
      return
    }
    try {
      const newPassword = await bcrypt.hash(password, 10)
      await sequelize.query( `insert into user (firstname, lastname, email, password) values ('${firstname}', '${lastname}', '${email}', '${newPassword}')`)
      res.status(200).json({message:"Values inserted"})
    }
    catch(err) {
      res.status(400).json({message: "email deja present"})
    }
});

router.post("/addbook", async (req, res) => {
  const { title, owner, author, year, type, publisher} = req.body;
  try {
    const checkBook = await sequelize.query(`Select * From Book where owner='${owner}' and title='${title}'`);
    if(checkBook[0].length !== 0) {
      await sequelize.query(`update book set nbBooks='${checkBook[0][0].nbBooks + 1}' where owner='${owner}' and title='${title}'`);
    } else {
      const result = await sequelize.query(
        `INSERT INTO book (title, owner, author, year, type, publisher) VALUES (?, ?, ?, ?, ?, ?)`,
        {
          replacements: [title, owner, author, year, type, publisher],
          type: Sequelize.QueryTypes.INSERT
        }
      );
    }
    res.status(200).json({ message: "Book added successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/notebook", async (req, res) => {
  const { title, email, note } = req.body;
  try {
    await sequelize.query(`update book set note='${note}' where email='${email}' and title='${title}'`);
    res.status(200).json({ message: "Note added successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.get("/getbooksfromowner/:owner", async (req, res) => {
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

router.post("/deletebook", async (req, res) => {
  const {title, owner} = req.body;
  try {
    const books = await sequelize.query(`Select * from book where owner='${owner}' and title='${title}'`);
    if(books[0].length === 0) {
      res.status(400).json({message: "livre inexistant"})
      return
    }
    const nbBooks = books[0][0].nbBooks
    if(nbBooks === 1) {
      await sequelize.query(`delete from book where owner='${owner}' and title='${title}'`)
    } else {
      await sequelize.query(`update book set nbBooks='${nbBooks - 1}' where owner='${owner}' and title='${title}'`)
    }
    res.status(200).json({message: "livre supprime"})
  }
  catch(err) {
    res.status(501).json({message: err})
  }
});


module.exports = router;
