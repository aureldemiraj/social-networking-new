import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllUsers = async () => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            fullName: true,
            email: true,
            birthDate: true,
            education: true,
            role: true,
        }
    });

    return users;
};

export const changedPasswordAfter = (JWTTimestamp, passwordChangedAt) => {
    const changedTimestamp = parseInt(
        passwordChangedAt.getTime() / 1000,
        10
    );

    return JWTTimestamp < changedTimestamp
};

export const correctPassword = (candidatePassword, userPassword) => {
    return bcrypt.compare(candidatePassword, userPassword)
};

export const createSendToken = (user, statusCode, res) => {
    const userId = user.id;
    const userRole = user.role;
    const token = jwt.sign({ userId, userRole }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
}

export const createUser = async (payload) => {
    // Encrypt user password
    const encryptedPassword = await bcrypt.hash(payload.password, 12);

    // Create user in database
    const newUser = createNewUser(payload, encryptedPassword);

    return newUser
};

export const createPasswordResetToken = async (userEmail) => {
    const resetToken = crypto.randomBytes(32).toString('hex');

    // these should be stored in database
    const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

    await updateUserForResetPassword(userEmail, passwordResetToken, passwordResetExpires);

    return resetToken
};

export const updateUserForResetPassword = async (userEmail, passwordResetToken, passwordResetExpires) => {
    await prisma.user.update({
        where: {
            email: userEmail
        },
        data: {
            passwordResetToken,
            passwordResetExpires
        }
    })

};

export const getUserByResetToken = async (passwordResetToken) => {
    const hashedPassword = crypto.createHash('sha256').update(passwordResetToken).digest('hex');

    const user = await prisma.user.findFirst({
        where: {
            passwordResetToken: hashedPassword,
            passwordResetExpires: {
                gt: new Date()
            }
        }
    });

    return user
};

export const updateUserPassword = async (userId, password) => {
    const encryptedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            password: encryptedPassword,
            passwordResetToken: null,
            passwordResetExpires: null
        }
    })
};

export const getUserbyEmail = async (email) => {
    const user = await prisma.user.findUnique({
        where: {
            email
        },
        select: {
            id: true,
            email: true,
            password: true,
            role: true
        }
    });

    return user
};

export const getUserbyId = async (id) => {
    const user = await prisma.user.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            fullName: true,
            email: true,
            birthDate: true,
            education: true,
            role: true
        }
    });

    return user
}

export const createNewUser = async (payload, encryptedPassword) => {
    const { email, fullName, birthDate, education } = payload;

    const newUser = await prisma.user.create({
        data: {
            email: email.toLowerCase(),
            fullName,
            password: encryptedPassword,
            birthDate: new Date(birthDate).toISOString(),
            education
        },
        select: {
            id: true,
            fullName: true,
            email: true,
            birthDate: true,
            education: true,
            role: true
        }
    });

    return newUser
};

