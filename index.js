require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const db = require("./database");

const logger = require("./middlewares/logger");
// const auth = require("./middlewares/auth");

const PORT = process.env.PORT || 5000;

//middle ware separate topic
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger);
//app.use(auth);

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}...`);
});

// Get Request
app.get("/api/users", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users");
    res.json(rows);
  } catch (error) {
    throw error;
  }
});

// Get Request Parameterized
app.get("/api/users/:id", async (req, res) => {
  let id = req.params.id;

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    if (rows.length > 0) {
      res.json(rows);
    } else {
      res.status(400).json({ msg: `id ${id} does not exists` });
    }
  } catch (error) {
    throw error;
  }
});

// Post Request
app.post("/api/users", (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;

  db.query(
    "INSERT INTO users (name, email, password) VALUES(?, ?, ?)",
    [name, email, password],
    (err, result, fields) => {
      if (err) {
        throw err;
      }

      res.status(200).json({ msg: `Data inserted with id ${result.insertId}` });
    }
  );
});

app.put("/api/users", (req, res) => {
  const { id, name, email, password } = req.body;

  db.query(
    "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?",
    [name, email, password, id],
    (err, result, fields) => {
      if (err) {
        throw err;
      }
      res.status(200).json({ msg: "Data updated successfully" });
    }
  );
});

app.delete("/api/users", (req, res) => {
  const { id } = req.body;

  db.query("DELETE FROM users WHERE id = ?", [id], (err, result, fields) => {
    if (err) {
      throw err;
    }
    res.status(200).json({ msg: "Data deleted successfully" });
  });
});
