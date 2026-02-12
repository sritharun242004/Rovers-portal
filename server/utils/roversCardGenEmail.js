const roversCardGenEmail = async (email, bib_code, pdf) => {

    const nodemailer = require("nodemailer");

    const transporter = nodemailer.createTransport({
        host: "gmail",
        port: 587,
        secure: false,
        auth: {
            user: "roversgwruae@gmail.com",
            pass: process.env.GMAIL_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: 'roversgwruae@gmail.com',
        to: email,
        subject: "Here is your event ID Card",
        // text: "Thanks",
        html: "<b>Thanks for registering the event</b>",
        attachments: [
            {
                filename: `${bib_code}.pdf`,
                path: pdf, // or use a Buffer if it's generated in memory
                contentType: 'application/pdf'
            }
        ]
    });
}

module.exports = roversCardGenEmail;