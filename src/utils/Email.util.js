import nodemailer from 'nodemailer';

import { emailHost, emailPort, emailUsername, emailPassword } from '../config/email.config';
export const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: emailHost,
        port: emailPort,
        auth: {
            user: emailUsername,
            pass: emailPassword,
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
