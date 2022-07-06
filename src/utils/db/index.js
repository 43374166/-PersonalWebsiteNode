const mysql = require('mysql')
let mysqlPwd = ''

if(process.env.NODE_ENV === 'development') {
  mysqlPwd = 'admin123'
}
if(process.env.NODE_ENV === 'production') {
  mysqlPwd = '@LicoLing123'
}
connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  // password: mysqlPwd,
  password: '@LicoLing123',
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
