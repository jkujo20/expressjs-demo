require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const mysql = require("mysql");
const logger = require("./middlewares/logger");
const auth = require("./middlewares/auth");

const PORT = process.env.PORT || 5000;

const connection = mysql.createConnection({
  host: process.env.HOST,
  database: process.env.DB,
  user: process.env.USER,
  password: process.env.PASSWORD,
});

connection.connect();

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
app.get("/api/users", auth, (req, res) => {
  console.log("Get Users ");
  console.log(`Authenticated ${req.authenticated}`);

  connection.query("SELECT * FROM users", (err, rows, fields) => {
    if (err) {
      throw err;
    } else {
      res.json(rows);
    }
  });
});

// Get Request Parameterized
app.get("/api/user/:id", (req, res) => {
  let id = req.params.id;

  //SQL Injection
  // connection.query(
  //   `SELECT * FROM employees WHERE id = ${id}`,

  connection.query(
    "SELECT * FROM users WHERE id = ?",
    [id],
    (err, rows, fields) => {
      if (err) {
        throw err;
      }

      if (rows.length > 0) {
        res.json(rows);
      } else {
        res.status(400).json({ msg: `id ${id} does not exists` });
      }
    }
  );
});

// Post Request
app.post("/api/users", (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;

  connection.query(
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


app.put("/api/users", (req, res) =>{
  const { id, name, email, password } = req.body;

  connection.query("UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?", 
  [name, email, password, id],
  (err, result, fields) => {
    if (err) {
      throw err;
    }
    res.status(200).json({msg: "Data updated successfully"});
  }
  
  );
})

app.delete("/api/users", (req, res) =>{
  const { id } = req.body;

  connection.query("DELETE FROM users WHERE id = ?", 
  [id],
  (err, result, fields) => {
    if (err) {
      throw err;
    }
    res.status(200).json({msg: "Data deleted successfully"});
  }  
  );
})