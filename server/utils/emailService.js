const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendEmail = async (to, subject, html) => {
    try {
        console.log(`[EMAIL] Attempting to send email to ${to}`);
        const info = await transporter.sendMail({
            from: `"Travollet" <${process.env.SMTP_USER}>`, // sender address
            to,
            subject,
            html,
        });

        console.log("[EMAIL] Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("[EMAIL] Error sending email: ", error);
        return null;
    }
};

module.exports = { sendEmail };
