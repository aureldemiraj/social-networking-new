import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { createNewUser } from './../repositories/userRepository.js';

export const changedPasswordAfter = (JWTTimestamp, passwordChangedAt) => {
    const changedTimestamp = parseInt(
        passwordChangedAt.getTime() / 1000,
        10
    )

    return JWTTimestamp < changedTimestamp
}

export const correctPassword = (candidatePassword, userPassword) => {
    return bcrypt.compare(candidatePassword, userPassword)
}

export const createSendToken = (user, statusCode, res) => {
    const userId = user.id;
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    const cookieOptions = {
        httpOnly: true
    };

    res.cookie('jwt', token, cookieOptions);

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}

export const createUser = async (payload) => {
    // Encrypt user password
    const encryptedPassword = await bcrypt.hash(payload.password, 12);

    // Create user in database
    const newUser = createNewUser(payload, encryptedPassword);

    return newUser
}