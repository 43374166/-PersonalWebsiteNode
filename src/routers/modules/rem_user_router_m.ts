const connectionRURM = require('../../utils/db/index') // 链接数据库

// 推荐所有用户
const recusers = (req:any, res:any) => {
  const sqlStr = `select id, username, nickname, user_pic from fd_users where nickname != ''`
  connectionRURM.query(sqlStr, (err:any, result:any) => {
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
}

const recuser = (req:any, res:any) => {
  const username = req.query.username
  const sqlStr = `select id, username, nickname, user_pic, age, gender, signature from fd_users where username=?`
  connectionRURM.query(sqlStr, username, (err:any, result:any) => {
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
}

module.exports = {
  recusers,
  recuser
}