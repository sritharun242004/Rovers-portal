const axios = require('axios');
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fontkit = require("@pdf-lib/fontkit");
const fs = require("fs");
const path = require("path");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const csv = require("csv-parser");
const roversCardGenEmail = require("../utils/roversCardGenEmail");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

async function cropFace(image, uaecode) {
    try {

        await axios.post("https://botapi.aspirenow.in/api/crop-images/", {
            data: {
                images: image,
                uaecode: uaecode
            }
        })
            .then((response) => {
                return response.image_link;
            })
            .catch((error) => {
                console.error(`Error cropping face`, error.message);
                return false
            });



    } catch (error) {
        console.error(`Error cropping face`, error.message);
        return false
    }
}

const uploadPdfToS3 = async (filePath, s3Key) => {
    const fileContent = fs.readFileSync(filePath);

    const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: s3Key,
        Body: fileContent,
        ContentType: "application/pdf",
    };

    try {
        const data = await s3.send(new PutObjectCommand(uploadParams));
        console.log(`✅ Uploaded to s3://${uploadParams.Bucket}/${s3Key}`);
        return data;
    } catch (err) {
        console.error("❌ Failed to upload to S3:", err);
        throw err;
    }
};

async function roversCard(student_name, gender, dob, sport_name, category, qr_image_path, sport_code, country_code, city_code, class_code, bib_code, uaecode) {
    try {

        // const filePath = path.join(__dirname, "../rovers/rovers_v2.csv")

        // const { student_name, gender, dob, sport_name, category, qr_image_path, sport_code, country_code, city_code, class_code, bib_code, uaecode } = req.body;

        // const student_name = Object.values(row)[0];

        const existingPdfBytes = fs.readFileSync(path.join(__dirname, "./Template_Rovers.pdf"));
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        pdfDoc.registerFontkit(fontkit);
        const pages = pdfDoc.getPages();

        const barlowFont = await pdfDoc.embedFont(fs.readFileSync(
            path.join(__dirname, "./Barlow/Barlow-Regular.ttf")
        ));

        const barlowBoldFont = await pdfDoc.embedFont(fs.readFileSync(
            path.join(__dirname, "./Barlow/Barlow-Bold.ttf")
        ));

        const wh = 50;

        const cx = 300;
        const cy = 200;
        const radius = 50;


        const response = await axios.get(qr_image_path, { responseType: 'arraybuffer' });
        const qrImagePath = response.data;

        const studentImageURL = `https://postactionsbucket.s3.ap-south-1.amazonaws.com/rovers_profile_pictures/${uaecode}.jpg`;

        const resStud = await axios.get(studentImageURL, { responseType: 'arraybuffer' });
        const studentImagePath = resStud.data;

        // const studentImagePath = path.join(__dirname, `../rovers/images_rounded/${row.bib_code}.png`);
        // const qrImagePath = path.join(__dirname, `../rovers/qr_images_v2/${bib_code}.jpg`);

        // if (!fs.existsSync(studentImagePath) || !fs.existsSync(qrImagePath)) {
        //   console.log(`Skipping row: Missing image for ${bib_code}`);
        //   return;
        // }



        const qr_image = await pdfDoc.embedPng(qrImagePath);

        const student_image = await pdfDoc.embedPng(studentImagePath);

        // const qr_image = await pdfDoc.embedPng(fs.readFileSync(path.join(__dirname, `../rovers/qr_images/${row.bib_code}.jpg`)));

        // const student_image = await pdfDoc.embedPng(fs.readFileSync(path.join(__dirname, `../rovers/images_rounded/${row.bib_code}.png`)));

        //student image
        pages[0].drawImage(student_image, {
            x: 21,
            y: 121,
            width: 85,
            height: 85,
        });

        //qr image
        pages[0].drawImage(qr_image, {
            x: 200,
            y: 53,
            width: wh,
            height: wh,
        });

        //student name
        pages[0].drawText(student_name, {
            x: 120,
            y: 170,
            size: 20,
            maxWidth: 200,
            font: barlowBoldFont,
            color: rgb(0, 0, 0),
        });

        //sport code
        pages[0].drawText(`${sport_code}-${country_code}-${city_code}-${class_code}`, {
            x: 120,
            y: 145,
            size: 20,
            maxWidth: 200,
            font: barlowFont,
            color: rgb(1, 1, 1),
        });

        //wib code
        pages[0].drawText(`${bib_code}`, {
            x: 160,
            y: 120,
            size: 20,
            maxWidth: 200,
            font: barlowBoldFont,
            color: rgb(1, 1, 1),
        });

        //gender
        pages[0].drawText(gender, {
            x: 23,
            y: 77,
            size: 8,
            maxWidth: 200,
            font: barlowFont,
            color: rgb(1, 1, 1),
        });

        //sport name
        pages[0].drawText(sport_name, {
            x: 116,
            y: 77,
            size: 8,
            maxWidth: 200,
            font: barlowFont,
            color: rgb(1, 1, 1),
        });

        //dob
        pages[0].drawText(dob, {
            x: 23,
            y: 52,
            size: 8,
            maxWidth: 200,
            font: barlowFont,
            color: rgb(1, 1, 1),
        });

        //category
        pages[0].drawText(category, {
            x: 117,
            y: 52,
            size: 8,
            maxWidth: 200,
            font: barlowFont,
            color: rgb(1, 1, 1),
        });

        const pdfBytes = await pdfDoc.save();
        const pdfFilePath = path.join(__dirname, `./generated/${bib_code}.pdf`);
        fs.writeFileSync(pdfFilePath, pdfBytes);

        uploadPdfToS3(pdfFilePath, `rovers_profile_pictures/${uaecode}.jpg`)
        roversCardGenEmail(email, bib_code, pdfFilePath)


        console.log("Successfully generated")
        // res.status(200).json({
        //     message: "Success",
        // });

    } catch (err) {
        // res.status(500).send(`Error getting data: ${err}`);
        console.log(err.message)
    }
};

module.exports = {
    cropFace, roversCard
};
