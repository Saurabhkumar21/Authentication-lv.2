import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  password: "2598",
  host: "localhost",
  database: "secrets",
  port: 5432
});
db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try{
   const response =  await db.query("SELECT * FROM users WHERE email = $1", [username]);
   if(response) {
    console.log("Email is already registered");
   } else{
    await db.query("INSERT INTO users (email, password) VALUES($1, $2)", [username, password]);
   }
    res.render("secrets.ejs")

  }catch(error){
    console.error(error);
  }
   
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try{
    const response = await db.query("SELECT * FROM users WHERE email = $1 AND password = $2", [username, password]);
    console.log(response.rows);
    if(response.rows.length!=0) {
      res.render("secrets.ejs");
    } else {
      res.render("home.ejs");
    }
  }catch(error){
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
