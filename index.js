const express = require("express");
const app = express();
const userModel = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", function (req, res) {
  res.render("index");
});

app.post("/register", async (req, res) => {
  let { username, name, age, email, password } = req.body;

  try {
    // Check if the user already exists
    let user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create the user
    let createdUser = await userModel.create({
      username,
      name,
      age,
      email,
      password: hash,
    });

    // Send response
    res.status(201).json({ message: "User registered successfully", user: createdUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.listen(3000);
