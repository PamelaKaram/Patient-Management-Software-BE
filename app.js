const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const port = 3000;
const connection = require('./database');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));

/*-------------Doctors apis---------------- */
// api to get all the appointments and help the doctor check his availability
app.get('/doctor/check',async(req,res)=>{
    let sql= await 'SELECT appointments.*, users.first_name, users.last_name FROM appointments INNER JOIN users ON appointments.user_id = users.id';
    connection.query(sql, (err, result)=>{
        if(err) throw err;
        console.log(result);
        res.json(result);
        res.send('Data fetched...');
    })
})

// api to get all the appointments before a specific date
app.get('/doctor/checkPrevious', async(req, res)=>{
    const today = new Date();
    const dateString = today.toISOString().slice(0,10);
    let sql = await `SELECT appointments.*, users.first_name, users.last_name FROM appointments INNER JOIN users ON appointments.user_id = users.id WHERE appointments.date < '${dateString}'`;
    connection.query(sql, (err, result)=>{
        if(err) throw err;
        console.log(result);
        res.json(result);
        res.send('Data fetched...');
    })  
})

// api to get all the appointments after a specific date
app.get('/doctor/checkFuture',async (req, res)=>{
    const today = new Date();
    const dateString = today.toISOString().slice(0,10);
    let sql = await `SELECT appointments.*, users.first_name, users.last_name FROM appointments INNER JOIN users ON appointments.user_id = users.id WHERE appointments.date > '${dateString}'`;
    connection.query(sql, (err, result)=>{
        if(err) throw err;
        console.log(result);
        res.json(result);
        res.send('Data fetched...');
    })
})
/*----------------------------------------- */

/*-------------Patient apis---------------- */
// api to get all the previous appointments of a specific patient
app.post('/patient/checkPrevious',async (req, res)=>{
    const today = new Date();
    const dateString = today.toISOString().slice(0,10);
    const email = req.body.email;
    let sql = await `SELECT appointments.*, users.email FROM users, appointments WHERE appointments.user_id=users.id AND users.email ='${email}'  AND date < '${dateString}'`;
    connection.query(sql, (err, result)=>{
        if(err) throw err;
        console.log(result);
        console.log(email);
        res.json(result);
        res.send('Data fetched...');
    })
})

// api to get all the future appointments of a specific patient
app.post('/patient/checkFuture',async (req, res)=>{
    const today = new Date();
    const dateString = today.toISOString().slice(0,10);
    const email = req.body.email;
    let sql = await `SELECT appointments.*, users.email FROM users, appointments WHERE appointments.user_id=users.id AND users.email ='${email}'  AND date > '${dateString}'`;
    connection.query(sql, (err, result)=>{
        if(err) throw err;
        console.log(result);
        console.log(email);
        res.json(result);
        res.send('Data fetched...');
    })
})
/*----------------------------------------- */

/*-------------Pharmacy apis---------------- */
/*------------------------------------------ */

app.listen(port, () => console.log(`Express app running on port ${port}!`));