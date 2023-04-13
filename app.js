const express = require('express');
const app = express();
const port = 3000;

const connection = require('./database');

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/user', (req,res)=>{
    let sql= 'SELECT * FROM users';
    connection.query(sql, (err, result)=>{
        if(err) throw err;
        console.log(result);
        res.send('Data fetched...');
    })
})

app.listen(port, () => console.log(`Express app running on port ${port}!`));