const nodeEmailer = require('nodemailer')

let transporter = nodeEmailer.createTransport({
  host: 'smtp.qq.com',
  secure: true,
  auth: {
      user: '320043337@qq.com',//输入你开启SMTP服务的QQ邮箱
      pass: 'ezcbpeyvnytdbggj' //输入我们刚才获得的那串字符
  }
})
// 导出模块，供别的文件使用
async function sentEmail(email, code){
  let status = null
  await new Promise((resolve, reject) => {
      transporter.sendMail({
          from: '320043337@qq.com',
          to: email, 
          subject: '验证码',
          html: `
          <p>验证码</p>
          <span style="font-size: 18px; color: red">` + code + `</span>`

      }, function (err, info) {
          if (err == null) {
              status = 1
              resolve()
          } else {
              status = 0
              reject()
          }
      });
  })
  return status
}

module.exports = sentEmail