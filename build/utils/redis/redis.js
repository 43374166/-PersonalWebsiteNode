"use strict";
const redis = require('redis');
const redisConfig = require('./config').redis;
const clientRedis = redis.createClient(redisConfig.port, redisConfig.host);
// 链接错误处理
clientRedis.on('error', (err) => {
    console.log('redis connect err', err);
});
clientRedis.on('connect', (err) => {
    console.log('redis connect success');
});
// 验证redis 就是开启了密码
clientRedis.auth(redisConfig.password);
const redisM = {};
/**
 * redisHelper setString function
 * @param key
 * @param value
 * @param expire
 */
redisM.setString = (key, value, expire) => {
    return new Promise((resolve, reject) => {
        clientRedis.set(key, value, function (err, result) {
            if (err) {
                console.log(err);
                reject(err);
            }
            if (!isNaN(expire) && expire > 0) {
                clientRedis.expire(key, parseInt(expire));
            }
            resolve(result);
        });
    });
};
/**
 * redisHelper getString function
 * @param key
 */
redisM.getString = (key) => {
    return new Promise((resolve, reject) => {
        clientRedis.get(key, (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve(result);
        });
    });
};
module.exports = redisM;
