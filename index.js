// server.js
const express = require("express");
const app = express();
const PORT = 3000;

// Import middleware and cart routes
const { authenticateToken } = require("./middleware/auth");

app.use(express.json());
app.use(authenticateToken); // Applies to all routes

app.get("/", (req, res) => {
  console.log("Hello World");
  res.json(`Hello World, User: ${req.user.username}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
