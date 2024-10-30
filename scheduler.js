// scheduler.js
const cron = require('node-cron');
const { exec } = require('child_process');

cron.schedule('0 0 */4 * *', () => {
  exec('node downloadFiles.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing downloadFiles.js: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
});