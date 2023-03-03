import express from 'express'
const router = express.Router()
const remUserRouter = require('./modules/rem_user_router_m')

router.get('/recusers', remUserRouter.recusers)

// 
router.get('/recuser', )

module.exports = router