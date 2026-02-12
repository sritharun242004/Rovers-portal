const { exec } = require('child_process');

// For Windows
exec('net start MongoDB', (error, stdout, stderr) => {
  if (error) {
    console.error('Failed to start MongoDB service. Please ensure MongoDB is installed properly.');
    console.error('1. Open Command Prompt as Administrator');
    console.error('2. Run: mongod --install');
    console.error('3. Then run: net start MongoDB');
    process.exit(1);
  }
  console.log('MongoDB service started successfully!');
});