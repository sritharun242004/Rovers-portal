import { exec } from 'node:child_process';
exec('mongod --version', (error, stdout, stderr) => {
  if (error) {
    console.error('MongoDB is not installed. Please follow these steps:');
    console.error('1. Download MongoDB Community Server from:');
    console.error('   https://www.mongodb.com/try/download/community');
    console.error('2. Run the installer and follow the installation wizard');
    console.error('3. During installation:');
    console.error('   - Choose "Complete" setup type');
    console.error('   - Check "Install MongoDB as a Service"');
    console.error('   - Install MongoDB Compass (optional but recommended)');
    console.error('4. After installation:');
    console.error('   a. Open Command Prompt as Administrator');
    console.error('   b. Run: net start MongoDB');
    console.error('\nOnce MongoDB is installed and running, try starting the application again.');
    process.exit(1);
  }
});