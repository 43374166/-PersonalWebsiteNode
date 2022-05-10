const express = require('express')
const router = express.Router()
const connection = require('../utils/db/index.js') // 链接数据库

router.get('/recusers', (req, res) => {
  const sqlStr = `select id, username, nickname, user_pic from fd_users where nickname != ''`
  connection.query(sqlStr, (err, result) => {
    if (err) return res.send({
      status: 1,
      message: err
    })

    if (result.length < 1) return res.send({
      status: 1,
      message: '获取用户信息失败！'
    })

    res.send({
      status: 0,
      message: '获取用户信息成功！',
      data: result
    })
  })
})

// 
router.get('/recuser', (req, res) => {
  const username = req.query.username
  const sqlStr = `select id, username, nickname, user_pic, age, gender, signature from fd_users where username=?`
  connection.query(sqlStr, username, (err, result) => {
    if (err) return res.send({
      status: 1,
      message: err
    })

    if (result.length < 1) return res.send({
      status: 1,
      message: '获取用户信息失败！'
    })

    res.send({
      status: 0,
      message: '获取用户信息成功！',
      data: result[0]
    })
  })
})

module.exports = router