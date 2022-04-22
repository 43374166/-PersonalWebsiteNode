const express = require('express')
const userRouter = require('./routers/usersRouter.js')
const userinfoRouter = require('./routers/userinfoRouter.js')
const app = express()
const config = require('./utils/config.js')
const expressJWT = require('express-jwt')
const ip = require('ip')

const Joi = require('joi')
const path = require('path')


// 解决跨域问题
const cors = require('cors')
app.use(cors())

// 解码 不然req.body会为空
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// 开启静态资源
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.use(expressJWT({
  secret: config.jwtSecretKey,
  algorithms: config.algorithms,
}).unless({path: [/^\/api\//,/^\/uploads\//] }))

app.use('/api', userRouter)
// 以my开头的接口都是有权限的接口  需要token
app.use('/my', userinfoRouter)

app.use((err,req,res,next) => {
  // 验证失败导致的错误
  if(err instanceof Joi.ValidationError) return res.send({status: 1, message: err})
  // 身份认证失败后的错误
  if(err.name === 'UnauthorizedError') return res.send({status: 1, message: '身份验证失败！需要携带token'})

  // 未知错误
  res.send({
    status: 1,
    message: err || '未知错误'
  })
})

var server = app.listen('8080', () => {
  let ipAddress = ip.address() // 开启服务的ip地址
  let port = server.address().port // 当前监听的端口
  console.log(`express serve running at http://${ipAddress}:${port}`);
})