const connection = require('../utils/db/index.js') // 链接数据库
const Joi = require('joi')
const ip = require('ip')
const fs = require('fs')
const path = require('path')

exports.getUserinfo = (req, res) => {

  const sqlStr = 'select id, username, nickname, email, user_pic, age, gender, is_new_user, signature from fd_users where id=?'
  // req上的user是token解析成功，express.jwt中间件帮我们挂上去的
  connection.query(sqlStr, req.user.id, (err, result) => {
    if (err) return res.send({
      status: 1,
      message: err
    })

    if (result.length !== 1) return res.send({
      status: 1,
      message: '获取用户信息失败！'
    })

    res.send({
      status: 0,
      message: '获取用户信息成功！',
      data: result[0]
    })
  })
}

exports.updateUserinfo = (req, res) => {
  const schema = Joi.object({
    nickname: Joi.string().max(12).required(),
    birthday: Joi.number().required(),
    gender: Joi.number().required(),
    signature: Joi.string().allow('')
  })
  let updateInfo = req.body

  const err = schema.validate(updateInfo)
  if (err.error) return res.send({
    status: 1,
    message: err
  })

  let sqlStr = 'update fd_users set nickname=?, gender=?, age=?, signature=? where id=?'
  connection.query(sqlStr,
    [
      nickname = updateInfo.nickname,
      gender = updateInfo.gender,
      age = updateInfo.birthday,
      signature = updateInfo.signature,
      id = req.user.id
    ],
    (err, result) => {
      if (err) return res.send({
        status: 1,
        message: err
      })

      if (result.affectedRows !== 1) return res.send({
        status: 1,
        message: '更新资料失败！清稍后再试！'
      })

      connection.query('update fd_users set is_new_user=1 where id=?', [id = req.user.id], (err, result) => {
        if (err) return res.send({
          status: 1,
          message: err
        })
        if (result.affectedRows !== 1) return res.send({
          status: 1,
          message: ''
        })

        res.send({
          status: 0,
          message: '修改资料成功！'
        })
      })
    })
}


exports.updateAvatar = (req, res) => {
  let ipAddress = process.env.NODE_ENV === 'development' ? '127.0.0.1' : '159.138.57.207'
  // const localIpAddress = 'localhost'
  const sqlAvatarUrl = `http://${ipAddress}:8080/uploads/avatars/${req.file.filename}`

  const deleteSql = 'select user_pic_filename from fd_users where id=?'
  // 查询之前的文件名 然后删除
  connection.query(deleteSql, [id = req.user.id], (err, result) => {
    console.log(result);
    if (err) return res.send({
      status: 1,
      message: err
    })
    if (result.length !== 1) {
      return res.send({
        status: 1,
        message: '数据库没有这个字段！'
      })
    }
    let fileName = result[0].user_pic_filename
    if(fileName != null) {
      const deleteFile = path.join(__dirname, `../../../uploads/avatars/${fileName}`)
      fs.unlinkSync(deleteFile, (err) => {
        if (err) {
          console.error(err)
          return
        }
      })
    }
  })

  const sqlStr = 'update fd_users set user_pic=?, user_pic_filename=? where id=?'
  connection.query(sqlStr, [user_pic = sqlAvatarUrl, user_pic_filename = req.file.filename, id = req.user.id], (err, result) => {
    if (err) return res.send({
      status: 1,
      message: err
    })
    if (result.affectedRows !== 1) return res.send({
      status: 1,
      message: '更改头像失败！'
    })

    res.send({
      status: 0,
      message: '更改头像成功！'
    })
  })
}