import { exec } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import fetch from 'node-fetch';

const downloadAndInstallMongoDB = async () => {
  const installerUrl = 'https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.5-signed.msi';
  const tempDir = process.env.TEMP || 'C:\\temp';
  const installerPath = path.join(tempDir, 'mongodb-installer.msi');

  try {
    // Ensure temp directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const response = await fetch(installerUrl);
    if (!response.ok) throw new Error(`Failed to download: ${response.statusText}`);

    const fileStream = fs.createWriteStream(installerPath);
    await pipeline(response.body, fileStream);
    // Create data directory
    const dataDir = 'C:\\data\\db';
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Install MongoDB
    await new Promise((resolve, reject) => {
      exec(
        `msiexec /i "${installerPath}" /quiet /qn INSTALLLOCATION="C:\\Program Files\\MongoDB\\Server\\7.0\\" ADDLOCAL="ALL"`,
        { maxBuffer: 1024 * 1024 * 10 }, // Increase buffer size
        (error, stdout, stderr) => {
          if (error) {
            console.error('Installation error:', error);
            reject(error);
            return;
          }
          resolve(stdout);
        }
      );
    });

    // Create MongoDB configuration file
    const mongoConfigPath = 'C:\\Program Files\\MongoDB\\Server\\7.0\\bin\\mongod.cfg';
    const configContent = `
systemLog:
  destination: file
  path: C:\\data\\log\\mongod.log
storage:
  dbPath: C:\\data\\db
net:
  bindIp: 127.0.0.1
  port: 27017
`;

    // Create log directory
    const logDir = 'C:\\data\\log';
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    fs.writeFileSync(mongoConfigPath, configContent);

    // Install and start MongoDB servi
    await new Promise((resolve, reject) => {
      exec(
        '"C:\\Program Files\\MongoDB\\Server\\7.0\\bin\\mongod.exe" --config "C:\\Program Files\\MongoDB\\Server\\7.0\\bin\\mongod.cfg" --install',
        (error, stdout, stderr) => {
          if (error) {
            console.error('Service installation error:', error);
            reject(error);
            return;
          }
          resolve(stdout);
        }
      );
    });
    await new Promise((resolve, reject) => {
      exec('net start MongoDB', (error, stdout, stderr) => {
        if (error) {
          console.error('Service start error:', error);
          reject(error);
          return;
        }
        resolve(stdout);
      });
    });
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

downloadAndInstallMongoDB().catch(console.error);