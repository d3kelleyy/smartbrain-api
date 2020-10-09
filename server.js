const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const saltRounds = 10;

const database = {
  users: [
    {
      id: "123",
      name: "John",
      email: "john@gmail.com",
      password: "cookies",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "124",
      name: "Sally",
      email: "sally@gmail.com",
      password: "bananas",
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  bcrypt.compare(
    "apples",
    "$2b$10$pFB1.nLhXk7IGuTi89tfCukJozdT6MA777EwleLjFFFro5CKBVOU.",
    function (err, result) {
      console.log("first guess", result);
    }
  );
  bcrypt.compare(
    "bananas",
    "$2b$10$MlHwcb87/vIum5gSe9/TRe/kGiQ3bpS7LsesJqD0A0bxMD8jXchGW",
    function (err, result) {
      console.log("second guess", result);
    }
  );
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json("error logging in");
  }
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  bcrypt.hash(password, saltRounds, function (err, hash) {
    console.log(hash);
  });
  database.users.push({
    id: "125",
    name: name,
    email: email,
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users[database.users.length - 1]);
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(400).json("user not found");
  }
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(400).json("user not found");
  }
});

app.listen(3001, () => {
  console.log("app is running on port 3001");
});
