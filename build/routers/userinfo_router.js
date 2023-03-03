"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const userinfoRouter = require('./modules/userinfo_router_m');
const upload = require('../middleWares/storage');
// get 请求
router.get('/userinfo', userinfoRouter.getUserinfo);
// post 请求
router.post('/userinfo', userinfoRouter.updateUserinfo);
router.post('/userinfo/avatar', upload.single('avatar'), userinfoRouter.updateAvatar);
module.exports = router;
