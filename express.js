// 导入
const express = require('express')
const postRouter = require('./src/routers/router')
const app = express()
const qs = require('querystring')

app.use((req, res, next) => {
  let str = '';

  req.on('data', (chunk) => {
    str += chunk
  })

  req.on('end', () => {
    const body = qs.parse(str)
    req.body = body
    next()
  })

})

app.use(express.json())  // 之后的req.body中的数据就不会是undefined了  所有路由之前
app.use(express.urlencoded({extended: false}))  //解析url-encoded的格式数据

// 监听get post请求
app.get('/user', (req, res) => {
  console.log(req.query); // 通过req.query获取get发生的请求中带的参数
  res.send('get请求成功!')
})

app.post('/user', (req, res) => {
  res.send('post请求成功！')
})


app.use(postRouter) // 注册路由模块  app.use()用来注册全局中间. 可以写成app.use('/api', postRouter)类似于静态资源服务器的前缀
// :id是一个动态参数 :id后面还可以写:name等  例如：/:id/:name/age等
// app.get('/:id', (req, res) => {
//   console.log(req.params);  // 通过req.params获取url通过:绑定的动态参数 默认是一个空对象
//   res.send(req.params)
// })


// express提供了好用的静态资源的函数 express.static() 通过它可以创建一个静态资源服务器
// app.use(express.static('src'))  用法 可以将css  js  图片等静态资源开放访问  没有前缀的127.0.0.1:8080/app.js
app.use(express.static('src'))
 // 托管多个静态资源服务器  如果相同的文件名 谁在前面就先找谁 前面的路径为挂载路径前缀 这样就可以访问路径了 127.0.0.1:8080/routers/express.js
 // 也不一定是routers还可以是别的自定义  就是不一定与文件夹名字不一样
app.use('../routers', express.static('routers')) 

// nodemon 方便调试  改了代码不用退出重启服务器

// 路由三部分组成app.METHOD(PATH, HANDLER) 对应请求方式，url地址，处理函数


// 中间件next()的使用  实现多个中间件连续调用的关键 自定义一个中间件  然后通过app.use(自定义的那个中间件)  这就是全局调用中间件‘
// 中间件和路由之间公用一个req和res
// 定义多个全局中间件 app.use(第一个)  app.use(第二个)  按照先后顺序执行  不使用app.use的中间件就叫做局部中间件
app.use((req, res, next) => {
  // 第一个中间件
  next()
})
// 可以使用req.body接受客户端发生的请求体数据   如果不配置解析表单的中间件 那么req.body默认等于undefined  在前面使用内置的中间件
// 局部中间件函数 

const vm = function(req, res, next) {
  next()
}
const vm2 = function(req, res, next) {
  next()
}

app.get('/', vm, (req, res) => {
  // 这就是局部中间件的使用
})

// 使用多个局部中间件
app.get('/user', vm, vm2, (req, res) => {

})
app.get('/user', [vm, vm2], (req, res) => {

})




app.listen(8080, () => {
  console.log('express server running at http://127.0.0.1:8080');
})