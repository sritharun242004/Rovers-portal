import QRCode from 'qrcode';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const students = [
  { id: '1', name: 'John Doe', class: 'Class A' },
  { id: '2', name: 'Jane Smith', class: 'Class B' },
  { id: '3', name: 'Bob Wilson', class: 'Class A' },
  { id: '4', name: 'Alice Brown', class: 'Class B' },
  { id: '5', name: 'Charlie Davis', class: 'Class A' }
];

const generateQRCodes = async () => {
  const dir = path.join(__dirname, '../public/qr-codes');
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }

  for (const student of students) {
    const qrData = JSON.stringify(student);
    const filePath = path.join(dir, `student-${student.id}.png`);

    try {
      await QRCode.toFile(
        filePath,
        qrData,
        {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        }
      );
    } catch (err) {
      console.error(`Failed to generate QR code for ${student.name}:`, err);
    }
  }
};

generateQRCodes().catch(console.error);