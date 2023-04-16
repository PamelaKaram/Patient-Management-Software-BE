const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const port = 3000;
const connection = require('./database');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));

/*------------------------------------------------------------------------------------------------*/
/*-----------------------------------Apis for all users-------------------------------------------*/

//api that will allow any registered email to reset their password 
app.post('/resetPassword', async (req, res)=>{
    const email = req.body.email;
    const password = req.body.password;
    const confirm_password = req.body.confirm_password;

    if(password !== confirm_password){
        // checking if passwords match
        return res.status(400).json({error: 'Passwords do not match'});
    }

    try{
        const [rows] = connection.query('SELECT * FROM users WHERE email=?', [email]);
        if(rows.length === 0){
            // checking if the email exists
            return res.status(400).json({error: 'Email does not exist'});
        }
        else{
            // hashing the password
            const hashedPassword = bcrypt.hashSync(password,10);
            const sql = 'UPDATE users SET password = ? WHERE email = ?';
            const values = [hashedPassword, email];
            connection.query(sql, values,(error, result)=>{
                if (error){
                    return res.status(500).json({error: "Unable to update the password"});
                }
                return res.status(200).json({message: "Password updated successfully"});
            });
        }

    }catch(error){
        return res.status(500).json({error: "Unable to update the password"});
    } 
})
/*------------------------------------------------------------------------------------------------*/


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
    const sql = await 'SELECT appointments.*, users.first_name, users.last_name FROM appointments INNER JOIN users ON appointments.user_id = users.id WHERE appointments.date < ?';
    
    try{
        connection.query(sql, dateString, (err, result)=>{
            if(err){
                return res.status(500).json({err:"Unable to retrieve"});
            }
            else{
                return res.status(200).json({result});
            }
        })
    }catch(err){
        return res.status(500).json({err:"Unable to retrieve"});
    }
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
app.get('/patient/checkPrevious',async (req, res)=>{
    const today = new Date();
    const dateString = today.toISOString().slice(0,10);
    const email = req.body.email;
    const sql = 'SELECT appointments.*, users.email FROM users, appointments WHERE appointments.user_id=users.id AND users.email = ?  AND date < ?';

    try{
        connection.query(sql,[email, dateString],(err, result)=>{
            if(err){
                return res.status(500).json({err:"Unable to retrieve"});
            }
            else{
                return res.status(200).json({result});
            }
        })
    }catch(err){
        return res.status(500).json({err:"Unable to retrieve"});
    } 
})

// api to get all the future appointments of a specific patient
app.get('/patient/checkFuture',async (req, res)=>{
    const today = new Date();
    const dateString = today.toISOString().slice(0,10);
    const email = req.body.email;
    const sql = 'SELECT appointments.*, users.email FROM users, appointments WHERE appointments.user_id=users.id AND users.email = ?  AND date > ?';

    try{
        connection.query(sql,[email, dateString],(err, result)=>{
            if(err){
                return res.status(500).json({err:"Unable to retrieve"});
            }
            else{
                return res.status(200).json({result});
            }
        })
    }catch(err){
        return res.status(500).json({err:"Unable to retrieve"});
    } 
})
/*----------------------------------------- */

/*-------------Pharmacy apis---------------- */
/*------------------------------------------ */

app.listen(port, () => console.log(`Express app running on port ${port}!`));