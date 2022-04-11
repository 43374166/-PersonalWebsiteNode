const redis = require('redis')
var client = redis.createClient(6379, '106.13.185.143')
client.on("error", function (err) {
  console.log("redis client连接失败",err);
});

client.set('color', 'red', redis.print)
client.get('color', function(err, value) {
  if (err) throw err;
  console.log('Got: ' + value)
  // client.quit();
})