const redis = require('redis')
const config = require('./config').redis

const client = redis.createClient(config.port, config.url)

// 链接错误处理
client.on('error', err => {
  console.log('redis connect err', err);
})

client.on('connect', err => {
  console.log('redis connect success');
})

// 验证redis 就是开启了密码
client.auth(config.password)

const redisM = {};

/**
 * redisHelper setString function
 * @param key
 * @param value
 * @param expire
 */
 redisM.setString = (key, value, expire) => {
  return new Promise((resolve, reject) => {
      client.set(key, value, function (err, result) {

          if (err) {
              console.log(err);
              reject(err);
          }

          if (!isNaN(expire) && expire > 0) {
              client.expire(key, parseInt(expire));
          }
          resolve(result)
      })
  })
}

/**
* redisHelper getString function
* @param key
*/
redisM.getString = (key) => {
  return new Promise((resolve, reject) => {
      client.get(key, function (err, result) {
          if (err) {
              console.log(err);
              reject(err)
          }
          resolve(result)
      });
  })
}

module.exports = redisM;