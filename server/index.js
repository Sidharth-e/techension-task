require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const verifyToken= require( "./middleware/auth");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const claimsRoutes = require("./routes/claims");

const connection = require("./db");


// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/claims",verifyToken, claimsRoutes);




const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));