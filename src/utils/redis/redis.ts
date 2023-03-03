const redis = require('redis')
const redisConfig = require('./config').redis

const clientRedis = redis.createClient(redisConfig.port, redisConfig.host)

// 链接错误处理
clientRedis.on('error', (err:any) => {
  console.log('redis connect err', err);
})

clientRedis.on('connect', (err:any) => {
  console.log('redis connect success');
})

// 验证redis 就是开启了密码
clientRedis.auth(redisConfig.password)

const redisM:any = {};

/**
 * redisHelper setString function
 * @param key
 * @param value
 * @param expire
 */
redisM.setString = (key:any, value:any, expire:any) => {
  return new Promise((resolve, reject) => {
    clientRedis.set(key, value, function (err:any, result:any) {

      if (err) {
        console.log(err);
        reject(err);
      }

      if (!isNaN(expire) && expire > 0) {
        clientRedis.expire(key, parseInt(expire));
      }
      resolve(result)
    })
  })
}

/**
 * redisHelper getString function
 * @param key
 */
redisM.getString = (key:any) => {
  return new Promise((resolve, reject) => {
    clientRedis.get(key, (err:any, result:any) => {
      if (err) {
        console.log(err);
        reject(err)
      }
      resolve(result)
    });
  })
}

module.exports = redisM;