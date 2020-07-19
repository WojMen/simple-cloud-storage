const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const app = express();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.run("CREATE TABLE users(name text, phone number)")

const SECRET = "abc";

app.use(bodyParser.urlencoded());

app.post("/register", (req, res) => {
  const validPhoneNumber = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

  if (!validPhoneNumber.test(req.body.phone)) {
    res.status(400).send(`Invalid phone number!`);
    return;
  }

  const token = jwt.sign({ username: req.body.username }, SECRET);
  db.run(`INSERT INTO users VALUES("${req.body.username}", "${req.body.validPhoneNumber})"`)
  res.send({
    token,
  });
});

app.listen(2137);
