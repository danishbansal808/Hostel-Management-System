const mysql = require('mysql');
var connection = mysql.createConnection({
  host: '35.232.171.90',
  user: 'danish1',
  password: '00000000',
  database: 'registration',
  port: 3306
});
connection.connect();
module.exports=connection;
