// 如果我们安装的包只在开发阶段用到  安装时候就是用npm install 包名 -D(--save-dev)
// 查看当前的下包镜像源 npm config get registry  切换 npm config set registry=https://registry.npm.taobao.org/ 默认的镜像源http://registry.npmjs.org/
// 可以安装nrm更快的查看切换下载源镜像npm i nrm -g  nrm ls查看    nrm use taobao安装淘宝镜像源
// npm 安装的包可分为项目包和全局包  全局包就是后面加-g的 一般只有工具意义的包才会安装到哪里去
// i5ting_toc可以将md文件转换为html文件  i5ting_toc -f 要转换的md文件路径 -o
// express和node内置的http类似 专门用来创建web服务器的

const express = require('express')
const userRouter = require('./routers/usersRouter.js')
const userinfoRouter = require('./routers/userinfoRouter.js')
const app = express()
const config = require('./utils/config.js')
const expressJWT = require('express-jwt')
const ip = require('ip')

const multer = require('multer') // 文件上传

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
    sattus: 1,
    message: err || '未知错误'
  })
})

var server = app.listen('8080', () => {
  let ipAddress = ip.address() // 开启服务的ip地址
  let port = server.address().port // 当前监听的端口
  console.log(`express serve running at http://${ipAddress}:${port}`);
})