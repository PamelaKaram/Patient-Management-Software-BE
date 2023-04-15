const express = require('express');
const app = express();
const port = 8080;
const db = require('./database');

app.get('/', (req, res) => res.send('vfergregregbebrbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbergre World!'));

app.get('/test', (req, res) => res.send('Test!'));

app.get("/createdb", (req, res) => {

    let sql = "CREATE DATABASE nodemysql";
  
    db.query(sql, (err) => {
  
      if (err) {
  
        throw err;
  
      }
  
      res.send("Database created");
  
    });
  
  });

app.listen(port, () => console.log(`Express app running on port ${port}!`));