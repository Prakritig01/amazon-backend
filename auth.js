require("dotenv").config();
require('./connections/connectMon');

const express = require("express");
const app = express();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.use(express.json());

const PORT = 5001;

const Users = require('./models/user.model');
const sessions = new Set();

const cors = require('cors');
app.use(cors());


// app.get("/admin", async (req, res) => {
//   res.json(users);
// });

app.post("/register", async (req, res) => {
  try {
    const { username, password,email } = req.body;
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    const user = { username: username, password: hash,email : email};
    const newUser = new Users(user);
    await newUser.save();
    res.json({ message: "User Created Successfully!", user : newUser });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { username, password,email } = req.body;

  // Find user by username
  const user = await Users.findOne({email : email});

  if (!user) {
    return res.status(401).json({ message: "Incorrect username!" });
  }

  try {
    // Safely check the password
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(400).json({ message: "Incorrect password!" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong!" });
  }

  const userInfo = { username: user.username };
  const token_data = { user: userInfo };
  const refresh_token = jwt.sign(token_data, process.env.REFRESH_TOKEN_SECRET);
  sessions.add(refresh_token);

  const token = generateToken(token_data);
  return res.json({ token, refresh_token });
// return res.json({ message: "Logged in successfully!" });
});

app.post("/token", async (req, res) => {
  const refresh_token = req.body.token;
  // if(!refresh_token) return res.status(401).json({ message: "Unathorized!" });
  !sessions.has(refresh_token)
    ? res.status(400).json({ message: "You need to login" })
    : jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN_SECRET,
        function (err, token_data) {
          if (err)
            return res
              .status(403)
              .json({ message: "Forbidden", error: err.message });
          const token = generateToken({ user: token_data.user });
          return res.json({ token });
        }
      );
});

app.delete("/logout", async (req, res) => {
  const refresh_token = req.body.token;
  if (!sessions.has(refresh_token))
    return res.status(200).json({ message: "No op" });
  sessions.delete(refresh_token);
  return res.json({ message: "Logged out!" });
});

function generateToken(data) {
  return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "20s",
  });
}

app.listen(PORT, () => {
  console.log(`server is running on ${PORT} `);
});
