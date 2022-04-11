const mysql = require('mysql')
const expressMysql = require('express-mysql')

let connection = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'admin123',
  database: 'fishdreams_db'
})


module.exports = {connection, client}
