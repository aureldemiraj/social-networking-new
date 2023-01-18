import dotenv from 'dotenv';
dotenv.config();

export const emailHost = process.env.EMAIL_HOST || '';
export const emailPort = process.env.EMAIL_PORT || '';
export const emailUsername = process.env.EMAIL_USERNAME || '';
export const emailPassword = process.env.EMAIL_PASSWORD || '';
