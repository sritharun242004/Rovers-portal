import { exec } from 'node:child_process';

exec('net start MongoDB', (error, stdout, stderr) => {
  if (error) {
    console.error('Failed to start MongoDB service. Please:');
    console.error('1. Ensure MongoDB is installed properly');
    console.error('2. Open Command Prompt as Administrator');
    console.error('3. Run: net start MongoDB');
    process.exit(1);
  }
});