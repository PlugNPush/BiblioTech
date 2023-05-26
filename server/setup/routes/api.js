const express = require("express");
const router = express.Router();

const data_db = require('./.data_db.js');

const { Sequelize } = require("sequelize");
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

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await sequelize.query(
    `SELECT * FROM users WHERE username = '${username}'`
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


module.exports = router;