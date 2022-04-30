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
          html: 
          `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>验证码</title>
              <style>
                * {
                  margin: 0;
                  padding: 0;
                  box-sizing: content-box;
                  color: white;
                }
                .box {
                  display: flex;
                  flex-direction: column;
                  justify-content: space-around;
                  align-items: center;
                  color: black;
                }
                .body {
                  width: 90%;
                  height: 85vh;
                  border-radius: 10px;
                  box-shadow: 10px 10px 10px 0 rgba(0, 0, 0, 0.2);
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  border: 1px solid rgba(0, 0, 0, 0.1);
                  background-image: linear-gradient(to top right, #5422A3, #BB008E, #F4396E, #FF7C53, #FFBC4C, #F9F871);
                }
              </style>
            </head>
            <body>
              <div class="box" style="width: 100%; height: 100vh;">
                <div style="color: black; font-size: 30px;">Verification Code</div>
                <div class="body">
                  <p style="font-size: 30px;">Fish Dream</p>
                  <p style="font-size: 20px; padding: 20px 0;">Hear me thank you Sign up for this site</p>
                  <div style="display: flex; align-items: center;">
                    <p style="font-size: 30px;">Code is: </p>
                    <span style="font-size: 36px; font-weight: 600; color: rgb(13, 0, 255);">${code}</span>
                  </div>
                </div>
                <div style="color: black;">行了行了不搞事了，快去注册吧！@copyright</div>
              </div>
            </body>
            </html>
          `

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

// code验证码可以存储到redis中  如果中小项目一般存储在session中
module.exports = sentEmail