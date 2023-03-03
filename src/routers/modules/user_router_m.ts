import { emit } from "process"

const fsURM = require('fs')
const sendEmail = require('../../utils/sendEmalil.js')
const connectionURM = require('../../utils/db/index.js')
const bcrypt = require('bcryptjs') // 密码加密
const jwt = require("jsonwebtoken") // 生成token
const config = require('../../utils/config.js')
const client = require('../../utils/redis/redis.js')
// 登录路由
const login = (req:any, res:any) => {
  const userinfo = req.body;

  const sqlStr = 'select * from fd_users where username=?'
  connectionURM.query(sqlStr, [userinfo.username], (err:any, result:any) => {
    if (err) {
      return res.send({
        status: 1,
        message: err.message
      })
    }

    if (result.length !== 1) {
      return res.send({
        status: 1,
        message: '用户不存在！'
      })
    }
    const compare = bcrypt.compareSync(userinfo.password, result[0].password);

    if (!compare) {
      return res.send({
        status: 1,
        message: '密码错误！'
      })
    }

    const user = {
      ...result[0],
      password: '',
      user_pic: ''
    }

    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: config.expiresIn
    }) // token有效时间为100天

    res.send({
      status: 0,
      message: '登录成功！',
      token: 'Bearer ' + tokenStr // 为了方便客户端使用token， 后端直接拼接上Bearer
    })
  })
}

// 注册用户路由
const registerUser = (req:any, res:any) => {
  const userinfo = req.body;

  client.getString(userinfo.email)
    .then((redisRes:any) => {
      if (redisRes === userinfo.verificationCode) {
        const sqlStr = "select * from fd_users where username=?"
        connectionURM.query(sqlStr, [userinfo.username], (err:any, result:any) => {
          if (err) {
            return res.send({
              status: 1,
              message: err.message
            })
          }
          if (result.length > 0) {
            return res.send({
              status: 1,
              message: '已存在用户名！请更换'
            })
          }

          // 加密密码
          userinfo.password = bcrypt.hashSync(userinfo.password, 10)

          // 插入新用户
          let intoSqlStr = 'insert into fd_users set ?'
          connectionURM.query(intoSqlStr, {
            username: userinfo.username,
            password: userinfo.password,
            email: userinfo.email
          }, (err:any, result:any) => {
            if (err) {
              return res.send({
                status: 1,
                message: err.message
              })
            }

            if (result.affectedRows !== 1) {
              return res.send({
                status: 1,
                message: '注册用户失败，请稍后再试！'
              })
            }

            res.send({
              status: 0,
              message: '注册成功！'
            })
          })
        })
      } else {
        res.send({
          status: 1,
          message: '验证码不正确！'
        })
      }

    })
    .catch((err:any) => {
      res.send({
        status: 1,
        message: '错误：' + err
      })
    })
}

// 发送邮箱路由
const sentemail = (req:any, res:any) => {
  const email = req.body.email
  console.log(email);
  // 判断邮箱是否被绑定过
  const sqlStr = 'select * from fd_users where email=?'
  connectionURM.query(sqlStr, [email], (err:any, result:any) => {
    if (err) {
      return res.send({
        status: 1,
        message: err.message
      })
    }
    if (result.length > 0) {
      return res.send({
        status: 1,
        message: '该邮箱已经被注册! '
      })
    }

    let randomNum = Math.random().toFixed(6).slice(-6)
    client.setString(email, randomNum, 300)
      .then((redisRes:any) => {
        sendEmail(email, randomNum)
          .then((resolve:any) => {
            res.send({
              status: 0,
              message: '验证码发送成功！',
            })
          })
          .catch((err:any) => {
            res.send({
              status: 1,
              message: '验证码发送失败！请稍后再试！'
            })
          })
      })
      .catch((err:any) => {
        res.send({
          status: 1,
          message: '请联系反馈给后台管理员！' + err
        })
      })
  })
}

// 修改密码的发送邮箱
const changePwdsSentemail = (req:any, res:any) => {
  const changePwdEmail = req.body.email
  // 判断邮箱是否被绑定过
  const sqlStr = 'select * from fd_users where email=?'
  connectionURM.query(sqlStr, [changePwdEmail], (err:any, result:any[]) => {
    if (err) {
      return res.send({
        status: 1,
        message: err.message
      })
    }
    if (result.length === 0) {
      return res.send({
        status: 1,
        message: '此邮箱没有注册过! '
      })
    }

    let randomNum = Math.random().toFixed(6).slice(-6)
    client.setString(changePwdEmail, randomNum, 300)
      .then((redisRes:any) => {
        sendEmail(changePwdEmail, randomNum)
          .then((resolve:any) => {
            res.send({
              status: 0,
              message: '验证码发送成功！',
            })
          })
          .catch((err:any) => {
            res.send({
              status: 1,
              message: '验证码发送失败！请稍后再试！'
            })
          })
      })
      .catch((err:any) => {
        res.send({
          status: 1,
          message: '请联系反馈给后台管理员！' + err
        })
      })
  })
}

// 修改密码
const changePwd = (req:any, res:any) => {
  let { changePwdEmail, password, verificationCode } = req.body
  console.log(changePwdEmail, password, verificationCode);

  client.getString(changePwdEmail)
    .then((redisRes:any) => {
      if (redisRes === verificationCode) {
        let sqlStr = 'update fd_users set password=? where email=?'

        // 加密密码
        password = bcrypt.hashSync(password, 10)

        connectionURM.query(sqlStr, [password=password, changePwdEmail], (err:any, result:any) => {
          if (err) return res.send({
            status: 1,
            message: err
          })
    
          if (result.affectedRows !== 1) return res.send({
            status: 1,
            message: '密码更新失败！'
          })

          res.send({
            status: 0,
            message: '密码修改成功！'
          })
        })
      } else {
        res.send({
          status: 1,
          message: '验证码不正确！'
        })
      }

    })
    .catch((err:any) => {
      res.send({
        status: 1,
        message: '错误：' + err
      })
    })
  
}

const getVersion = (req:any, res:any) => {
  const getApks = fsURM.readdirSync('/node-server/uploads/apk')
  const app_version = getApks[getApks.length - 1].substring(0, getApks[getApks.length - 1].lastIndexOf('.')).split('-')[1]
  // console.log(app_version);
  res.send({
    status: 0,
    data: {
      app_version: app_version,
    },
    message: '获取成功'
  })
}

module.exports = {
  login,
  registerUser,
  sentemail,
  changePwdsSentemail,
  changePwd,
  getVersion,
}