const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const app = express();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');
const createJWTProtector = require("jwt-express-protector").default;

db.run("CREATE TABLE users(name text, phone number)")

const SECRET = "abc";

const jwtProtector = createJWTProtector({
  secret: SECRET,
  verifyUser({ username }) {
    db.get(`SELECT phone FROM users where name="${username}"`, function(err, row) {
      console.log(row.phone);
    })
    return {
      username
    }
  }
});

app.use(bodyParser.urlencoded({ extended: false }));

app.post("/register", (req, res) => {
  const validPhoneNumber = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,6}$/im;

  if (!validPhoneNumber.test(req.body.phone)) {
    res.status(400).send(`Invalid phone number!`);
    return;
  }

  const token = jwt.sign({ username: req.body.username }, SECRET);
  db.run(`INSERT INTO users VALUES("${req.body.username}", "${req.body.phone}")`);
  res.send({
    token,
  });
});

app.post("/upload", jwtProtector, (req, res) => {
  res.send(req.user);
})


app.listen(2137);
