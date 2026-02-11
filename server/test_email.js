require('dotenv').config();
const { sendEmail } = require('./utils/emailService');

const run = async () => {
    console.log('Testing Email Service...');
    console.log('SMTP Host:', process.env.SMTP_HOST);
    console.log('SMTP User:', process.env.SMTP_USER);
    // Mask password to safe log length
    const pass = process.env.SMTP_PASS || '';
    console.log('SMTP Pass Length:', pass.length);
    console.log('SMTP Pass Start:', pass.substring(0, 3) + '...');

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
        console.error('ERROR: SMTP credentials missing in .env');
        return;
    }

    const result = await sendEmail(
        process.env.ADMIN_EMAIL || process.env.SMTP_USER,
        'Test Email from Travollet',
        '<h1>It works!</h1><p>This is a test email from your Travollet backend.</p>'
    );

    if (result) {
        console.log('Email sent successfully!', result.messageId);
    } else {
        console.log('Failed to send email.');
    }
};

run();
