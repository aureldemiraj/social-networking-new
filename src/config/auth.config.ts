import dotenv from 'dotenv';
dotenv.config();

export const jwtSecret = process.env.JWT_SECRET || '';
export const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '';
