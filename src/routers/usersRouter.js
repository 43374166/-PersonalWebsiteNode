const express = require('express');
const router = express.Router()
const userRouter = require('./usersRouter_M')


router.post('/login', userRouter.login)

router.post('/register', userRouter.registerUser)

router.post('/register/sentemail', userRouter.sentemail)

module.exports = router