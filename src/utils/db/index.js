const mysql = require('mysql')
let mysqlPwd = process.env.NODE_ENV === 'development' ? 'admin123' : '@LicoLing123'

connection = mysql.createConnection({
  // host: '127.0.0.1',
  host: '159.138.57.207',
  user: 'root',
  password: mysqlPwd,
  // password: '@LicoLing123',
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
