const multer = require('multer')
const pathStorage = require('path')

const storage = multer.diskStorage({
  // 配置文件上传后存储的路径
  destination: function (req:any, file:any, cb:any) {
    // NodeJS的两个全局变量
    // console.log(__dirname);  //获取当前文件在服务器上的完整目录 
    // console.log(__filename); //获取当前文件在服务器上的完整路径 
    cb(null, pathStorage.join(__dirname,'../../../uploads/avatars'))
  },
  // 配置文件上传后存储的路径和文件名
  filename: function (req:any, file:any, cb:any) {
    // let extName = file.originalname.slice(file.originalname.lastIndexOf('.')); // 截取文件的后缀名
    let extName = pathStorage.extname(file.originalname)
    let fileName = Date.now()
    cb(null, fileName + extName)
  }
})

// 上传类型限制
const fileFilter =(req:any, file:any, cb:any) => {
  let acceptableMime = ['image/jpeg'];

  // 限制类型  null是固定写法
  if(acceptableMime.indexOf(file.mimetype) !== -1) {
    cb(null, true) // 通过上传
  }else {
    cb(null, false)  // 拒绝上传
  }
}

const limits = {
  fileSize: "10M",  // 设置上传大小  可选
}

const upload = multer({
  storage,
  fileFilter,
  limits
})

module.exports = upload