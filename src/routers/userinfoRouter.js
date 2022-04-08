const express = require('express')
const router = express.Router()
const userinfoRouter = require('./userinfoRouter_M.js')

const upload = require('../middleWares/storage.js')


router.get('/userinfo', userinfoRouter.getUserinfo)
router.post('/userinfo', userinfoRouter.updateUserinfo)
router.post('/userinfo/avatar', upload.single('avatar'), userinfoRouter.updateAvatar)

module.exports = router