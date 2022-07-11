const express = require('express');
const router = express.Router()
const userRouter = require('./modules/user_router_m')

// post请求
router.post('/login', userRouter.login)
router.post('/register', userRouter.registerUser)
router.post('/register/sentemail', userRouter.sentemail)
router.post('/changepwd/sentemail', userRouter.changePwdsSentemail)
router.post('/changepwd', userRouter.changePwd)

// get 请求
router.get('/getVersion', userRouter.getVersion)

module.exports = router