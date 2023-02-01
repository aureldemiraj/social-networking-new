import nodemailer from 'nodemailer';

import { HOST, PORT, USERNAME, PASSWORD } from '../config/email.config';

export const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: HOST,
        port: PORT,
        auth: {
            user: USERNAME,
            pass: PASSWORD,
        },
    });

    const mailOptions = {
        from: 'Aurel Demiraj <aurel@gmail.com>',
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    await transporter.sendMail(mailOptions);
};
