const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();

const SECRET = "abc";

app.use(bodyParser.urlencoded());

app.post("/register", (req, res) => {
  const validPhoneNumber = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

  if (!validPhoneNumber.test(req.body.phone)) {
    res.status(400).send(`Invalid phone number!`);
    return;
  }

  const token = jwt.sign({ username: req.body.username }, SECRET);

  res.send({
    token,
  });
});

app.listen(2137);
