const mysql = require('mysql')

connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'admin123',
  database: 'fishdreams_db'
})

connection.connect(err=>{
  if(err) {
    console.log(err);
  }else {
    console.log('mysql connect success');
  }
});

module.exports = connection
