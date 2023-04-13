const express = require('express');
const app = express();
const port = 3000;

const connection = require('./database');

app.get('/', (req, res) => res.send('Hello World!'));

// api to get all the appointments and help the doctor check his availability
app.get('/doctor/check',(req,res)=>{
    let sql= 'SELECT appointments.*, users.first_name, users.last_name FROM appointments INNER JOIN users ON appointments.user_id = users.id';
    connection.query(sql, (err, result)=>{
        if(err) throw err;
        console.log(result);
        res.json(result);
        res.send('Data fetched...');
    })
})

// api to get all the appointments before a specific date
app.get('/doctor/checkPrevious', (req, res)=>{
    const today = new Date();
    const dateString = today.toISOString().slice(0,10);
    let sql = `SELECT appointments.*, users.first_name, users.last_name FROM appointments INNER JOIN users ON appointments.user_id = users.id WHERE appointments.date < '${dateString}'`;
    connection.query(sql, (err, result)=>{
        if(err) throw err;
        console.log(result);
        res.json(result);
        res.send('Data fetched...');
    })
    
})

app.listen(port, () => console.log(`Express app running on port ${port}!`));