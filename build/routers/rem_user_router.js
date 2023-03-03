"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const remUserRouter = require('./modules/rem_user_router_m');
router.get('/recusers', remUserRouter.recusers);
// 
router.get('/recuser');
module.exports = router;
