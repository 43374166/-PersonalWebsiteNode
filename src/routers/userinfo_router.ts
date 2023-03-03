import express from 'express'
const router = express.Router()
const userinfoRouter = require('./modules/userinfo_router_m')

const upload = require('../middleWares/storage')

// get 请求
router.get('/userinfo', userinfoRouter.getUserinfo)

// post 请求
router.post('/userinfo', userinfoRouter.updateUserinfo)
router.post('/userinfo/avatar', upload.single('avatar'), userinfoRouter.updateAvatar)

module.exports = router