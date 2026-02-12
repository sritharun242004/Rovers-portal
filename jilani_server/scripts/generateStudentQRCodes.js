require('dotenv').config();
const mongoose = require('mongoose');
const QRCode = require('qrcode');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');
const Student = require('../models/Student');

// Configure AWS S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Check AWS configuration
const isS3Configured = process.env.AWS_BUCKET_NAME &&
                       process.env.AWS_ACCESS_KEY_ID &&
                       process.env.AWS_SECRET_ACCESS_KEY &&
                       process.env.AWS_REGION;

if (!isS3Configured) {
  console.error('❌ AWS S3 configuration missing!');
  console.error('Required environment variables:');
  console.error('- AWS_BUCKET_NAME');
  console.error('- AWS_ACCESS_KEY_ID');
  console.error('- AWS_SECRET_ACCESS_KEY');
  console.error('- AWS_REGION');
  process.exit(1);
}

// QR Code generation options (matching your reference image dimensions)
const QR_OPTIONS = {
  width: 300,
  height: 300,
  margin: 2,
  color: {
    dark: '#000000',
    light: '#ffffff'
  },
  errorCorrectionLevel: 'M'
};

// Upload QR code image to S3
async function uploadQRCodeToS3(buffer, studentId) {
  const key = `student-qrcodes/${studentId}.png`;
  
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: 'image/png',
    ACL: 'public-read'
  };

  try {
    const result = await s3Client.send(new PutObjectCommand(uploadParams));
    const s3Url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    return s3Url;
  } catch (error) {
    console.error(`❌ Failed to upload QR code for student ${studentId}:`, error);
    throw error;
  }
}

// Generate QR code for a single student
async function generateStudentQRCode(student) {
  try {
    // QR code data contains the student ID for scanning
    const qrData = student._id.toString();
    
    console.log(`📱 Generating QR code for student: ${student.name} (${student._id})`);
    
    // Generate QR code as buffer
    const qrBuffer = await QRCode.toBuffer(qrData, QR_OPTIONS);
    
    // Upload to S3
    const s3Url = await uploadQRCodeToS3(qrBuffer, student._id);
    
    // Update student record with QR code URL
    await Student.findByIdAndUpdate(student._id, { qrcode: s3Url });
    
    console.log(`✅ QR code generated and uploaded for ${student.name}`);
    console.log(`   URL: ${s3Url}`);
    
    return { success: true, studentId: student._id, url: s3Url };
  } catch (error) {
    console.error(`❌ Failed to process student ${student.name} (${student._id}):`, error);
    return { success: false, studentId: student._id, error: error.message };
  }
}

// Process students in batches to avoid overwhelming S3
async function processBatch(students, batchNumber, batchSize) {
  console.log(`\n🔄 Processing batch ${batchNumber} (${students.length} students)`);
  
  const results = [];
  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    console.log(`  [${i + 1}/${students.length}] Processing ${student.name}...`);
    
    const result = await generateStudentQRCode(student);
    results.push(result);
    
    // Small delay to avoid rate limiting
    if (i < students.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`📊 Batch ${batchNumber} completed: ${successful} successful, ${failed} failed`);
  return results;
}

// Main function
async function generateAllStudentQRCodes() {
  console.log('🚀 Starting QR code generation for all students...');
  console.log(`📋 AWS S3 Bucket: ${process.env.AWS_BUCKET_NAME}`);
  console.log(`🌍 AWS Region: ${process.env.AWS_REGION}`);
  
  try {
    // Connect to MongoDB
    console.log('\n📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ Connected to MongoDB');
    
    // Get all students
    console.log('\n📊 Fetching students...');
    const allStudents = await Student.find({}).select('_id name qrcode');
    console.log(`📋 Found ${allStudents.length} students total`);
    
    // Filter students who don't have QR codes yet
    const studentsWithoutQR = allStudents.filter(student => !student.qrcode || student.qrcode === '');
    const studentsWithQR = allStudents.length - studentsWithoutQR.length;
    
    console.log(`✅ Students with QR codes: ${studentsWithQR}`);
    console.log(`❌ Students without QR codes: ${studentsWithoutQR.length}`);
    
    if (studentsWithoutQR.length === 0) {
      console.log('🎉 All students already have QR codes! Nothing to do.');
      return;
    }
    
    console.log(`\n🔄 Processing ${studentsWithoutQR.length} students without QR codes...`);
    
    // Process in batches of 10 to manage memory and avoid rate limiting
    const BATCH_SIZE = 10;
    const totalBatches = Math.ceil(studentsWithoutQR.length / BATCH_SIZE);
    
    let totalSuccessful = 0;
    let totalFailed = 0;
    const allResults = [];
    
    for (let i = 0; i < studentsWithoutQR.length; i += BATCH_SIZE) {
      const batch = studentsWithoutQR.slice(i, i + BATCH_SIZE);
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
      
      const batchResults = await processBatch(batch, batchNumber, BATCH_SIZE);
      allResults.push(...batchResults);
      
      const batchSuccessful = batchResults.filter(r => r.success).length;
      const batchFailed = batchResults.filter(r => !r.success).length;
      
      totalSuccessful += batchSuccessful;
      totalFailed += batchFailed;
      
      // Progress update
      console.log(`📈 Overall Progress: ${batchNumber}/${totalBatches} batches completed`);
      console.log(`   Total Successful: ${totalSuccessful}`);
      console.log(`   Total Failed: ${totalFailed}`);
      
      // Delay between batches
      if (i + BATCH_SIZE < studentsWithoutQR.length) {
        console.log('⏳ Waiting 2 seconds before next batch...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    // Final summary
    console.log('\n🎉 QR Code generation completed!');
    console.log('📊 Final Summary:');
    console.log(`   Total Students: ${allStudents.length}`);
    console.log(`   Already had QR codes: ${studentsWithQR}`);
    console.log(`   Successfully generated: ${totalSuccessful}`);
    console.log(`   Failed: ${totalFailed}`);
    
    if (totalFailed > 0) {
      console.log('\n❌ Failed students:');
      const failedResults = allResults.filter(r => !r.success);
      failedResults.forEach(result => {
        console.log(`   - ${result.studentId}: ${result.error}`);
      });
    }
    
    // Verify final count
    const finalCount = await Student.countDocuments({ qrcode: { $ne: '' } });
    console.log(`\n✅ Verification: ${finalCount} students now have QR codes`);
    
  } catch (error) {
    console.error('❌ Script failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    console.log('✅ Script completed');
  }
}

// Run the script
generateAllStudentQRCodes().catch(console.error);