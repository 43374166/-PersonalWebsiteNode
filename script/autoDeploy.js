/* eslint-disable */
const path = require('path');
const { NodeSSH } = require('node-ssh');
const config = require('./config.js');
const localPath = path.join(__dirname, '../'); // 本地路径
const remotePath = config.remotePath; // 部署路径

const ssh = new NodeSSH();

// 获取当前git分支
const exec = require('child_process').execSync;
const name = exec('git rev-parse --abbrev-ref HEAD')
  .toString()
  .trim();
if (name !== 'main') return console.log('⚠️⚠️⚠️请确保在 "main" 分支发布');

ssh.connect({
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
  })
  .then(() => {
    console.log('😜SSH connect success!');
    console.log('😜部署路径', config.remotePath);
    const failed = [];
    const successful = [];
    ssh.putDirectory(localPath, remotePath, {
        recursive: true,
        concurrency: 10,
        validate(itemPath) {
          const baseName = path.basename(itemPath);
          return (
            baseName.substr(0, 1) !== '.' && baseName !== 'node_modules' // do not allow dot files
          ); // do not allow node_modules
        },
        tick(localPath, remotePath, error) {
          if (error) {
            failed.push(localPath);
          } else {
            successful.push(localPath);
          }
        },
      })
      .then(res => {
        for (let i = 0; i < successful.length; i++) {
          console.log(successful[i]);
        }
        console.log('👀部署结束');
        console.log('💩部署失败文件数：' + failed.length, failed.join(', '));
        console.log('😜部署成功文件数：' + successful.length);
        process.exit();
      })
      .catch(err => {
        console.log(err);
      })
  });