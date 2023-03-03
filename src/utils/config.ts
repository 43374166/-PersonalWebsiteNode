module.exports = {
  jwtSecretKey: 'FishDream 520 @Lico', // 加密和解密的token密钥
  expiresIn: '48h', // token生效时间
  algorithms: ['HS256'] // 设置算法express-jwt
}