const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
  allowEIO3: true,
  cors: {
    origin: 'http://localhost:8888',
    methods: ['GET', 'POST'],
    credentials: true
  }
})

const userRouter = require('./routers/user_router.js')
const userinfoRouter = require('./routers/userinfo_router.js')
const recommentUsers = require('./routers/rem_user_router.js')

const config = require('./utils/config.js')
const expressJWT = require('express-jwt')
const ip = require('ip')

const Joi = require('joi')
const path = require('path')


// 解决跨域问题
const cors = require('cors')
app.use(cors())

// 解码 不然req.body会为空
app.use(express.urlencoded({
  extended: false
}))
app.use(express.json())

// 开启静态资源
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')))

app.use(expressJWT({
  secret: config.jwtSecretKey,
  algorithms: config.algorithms,
}).unless({
  path: [/^\/api\//, /^\/uploads\//, /^\/users\//]
}))

console.log('current NODE_ENV: ', process.env.NODE_ENV);

app.use('/api', userRouter)
// 以my开头的接口都是有权限的接口  需要token
app.use('/my', userinfoRouter)
// 推荐用户
app.use('/users', recommentUsers)




app.use((err, req, res, next) => {
  // 验证失败导致的错误
  if (err instanceof Joi.ValidationError) return res.send({
    status: 1,
    message: err
  })
  // 身份认证失败后的错误
  if (err.name === 'UnauthorizedError') return res.send({
    status: 1,
    message: '身份验证失败！需要携带token'
  })

  // 未知错误
  res.send({
    status: 1,
    message: err || '未知错误'
  })
})

var server = http.listen('8080', () => {
  let ipAddress = ip.address() // 开启服务的ip地址
  let port = server.address().port // 当前监听的端口
  console.log(`express serve running at http://${ipAddress}:${port}`);
})


let users = []; // 所有用户
let onlineUsers = [] // 在线用户

// socket.io connect
io.on('connection', (socket) => {
  
  // 监听是否上线
  socket.on('online', (data, callback) => {
    let isOnline = false
    io.sockets.sockets.forEach(us => {
      if (us.username == data.username) {
        islogin = true;
      }
    });

    if(!isOnline) {
      onlineUsers.push(data)
      socket.username = data.username
      // console.log(io.sockets.sockets.username);
      // 在线发给前端
      io.emit('online', onlineUsers);
      callback(true)
    }else {
      callback(false)
    }
  })

  // 监听私聊
  socket.on('privateChat', (data, callback) => {
    /* 找到对应的私聊对象 */
    // console.log(io.sockets.sockets);
    io.sockets.sockets.forEach(us => {
      // console.log(us.username);
      if (us.username == data.receiver) {
        data.type = 'user';
        // 发给指定的人
        io.to(us.id).emit('updateChatMessageList', data);
      }
    });


  })

  socket.on('disconnect', () => {
    // console.log('user disconnect');
    let index = onlineUsers.findIndex(i => i.username == socket.username);
    if (index != -1) {
      onlineUsers.splice(index, 1);
      /* 通知前端 */
      io.emit('online', onlineUsers);
    }
  })
})