const express = require("express");
const app = express();

const cors = require("cors");

require("dotenv").config();

app.use(express.json());
app.use(cors());

const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const dbPath = path.join(__dirname, "map_auth.db");

const { v4: uuidv4 } = require("uuid");
const { open } = sqlite;

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let db;

const initServerAndDb = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(4001, () => {
      console.log("The server is running at port 4001");
    });
  } catch (err) {
    console.log(`Database ${err}`);
  }
};

initServerAndDb();

const authenticateToken = (request, response, next) => {
  let jwtToken;

  const authHeader = request.headers["authorization"];

  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }

  if (jwtToken === undefined) {
    return response.status(401).send({ message: "User not loged in" });
  }

  jwt.verify(jwtToken, process.env.MY_SECRET_TOKEN, async (err, payload) => {
    if (err) {
      return response.status(401).send({ message: "Invalid JWT token" });
    }

    request.userId = payload.userId;
    next();
  });
};

app.post("/api/signup", async (request, response) => {
  const { username, email, password } = request.body;

  const checkUserEmail = `SELECT * FROM users WHERE email=? `;
  const checkUserName = `SELECT * FROM users WHERE username=? `;

  try {
    const dbuserName = await db.get(checkUserName, [username]);

    if (dbuserName) {
      return response
        .status(400)
        .send({ message: "Username Already Exists Try Again" });
    }
    const dbUser = await db.get(checkUserEmail, [email]);

    if (dbUser) {
      return response.status(400).send({ message: "User ALready Exists" });
    }

    const hashedPwd = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    const createUserQuery = ` INSERT INTO users (id, username,email,password) VALUES (?,?,?,?)`;

    const dbResponse = await db.run(createUserQuery, [
      userId,
      username,
      email,
      hashedPwd,
    ]);

    response
      .status(201)
      .send({ message: "Successfull Created", lastId: dbResponse.lastID });
  } catch (err) {
    response.status(500).send({ message: "Internal Server Error" });
    console.log(err);
  }
});

app.post("/api/login", async (req, res) => {
  const { identifier, password } = req.body;

  const userQuery = `SELECT * FROM users WHERE username = ? OR email = ?`;

  try {
    const dbUser = await db.get(userQuery, [identifier, identifier]);

    if (!dbUser) {
      return res.status(400).json({ message: "Invalid Username or Email" });
    }

    const passwordMatch = await bcrypt.compare(password, dbUser.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const jwtToken = jwt.sign(
      { userId: dbUser.id },
      process.env.MY_SECRET_TOKEN
    );

    res.status(200).json({ message: "Login Successful", jwtToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/map", authenticateToken, (req, res) => {
  res.json({
    center: { lat: 20.5937, lng: 78.9629 }, // India's latitude & longitude
    zoom: 5, // Zoom out level
    message: "Map data retrieved successfully",
  });
});
