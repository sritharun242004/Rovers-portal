const { exec } = require('child_process');

const checkMongoDB = () => {
  return new Promise((resolve, reject) => {
    // Check if MongoDB is installed
    exec('mongod --version', (error) => {
      if (error) {
        // console.error('\x1b[31m%s\x1b[0m', 'MongoDB is not installed!');
        // console.log('\nPlease follow these steps to install MongoDB:');
        // console.log('1. Download MongoDB Community Server:');
        // console.log('   https://www.mongodb.com/try/download/community');
        // console.log('2. Run the installer and follow the installation wizard');
        // console.log('3. During installation:');
        // console.log('   - Choose "Complete" setup type');
        // console.log('   - Check "Install MongoDB as a Service"');
        // console.log('4. Create data directory:');
        // console.log('   mkdir C:\\data\\db');
        // console.log('\nAfter installation:');
        // console.log('1. Open Command Prompt as Administrator');
        // console.log('2. Run: net start MongoDB');
        reject(new Error('MongoDB is not installed'));
        return;
      }

      // Check if MongoDB service is running
      exec('net start | findstr /i "MongoDB"', (error, stdout) => {
        if (!stdout.includes('MongoDB')) {
          // Try to start MongoDB service
          exec('net start MongoDB', (error) => {
            if (error) {
              reject(new Error('Failed to start MongoDB service'));
              return;
            }
            resolve();
          });
        } else {
          resolve();
        }
      });
    });
  });
};

module.exports = checkMongoDB;
