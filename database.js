let mysql = require('mysql2');

let db = mysql.createConnection({
    host: 'mysql',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'patient_software'
});

db.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
  
    console.log('Connected to the MySQL server.');
  });

module.exports = db;