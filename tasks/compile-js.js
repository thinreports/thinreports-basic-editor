const exec = require('child_process').exec;

exec('ls', (err, stdout, stderr) => {
  console.log(stdout);
});
