const express = require('express');
const router = express.Router()
const userRouter = require('./usersRouter_M')


router.post('/login', userRouter.login)
router.post('/register', userRouter.registerUser)
router.post('/register/sentemail', userRouter.sentemail)
router.post('/changepwd/sentemail', userRouter.changePwdsSentemail)
router.post('/changepwd', userRouter.changePwd)
router.get('/getVersion', userRouter.getVersion)

module.exports = router