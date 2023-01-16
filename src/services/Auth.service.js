import crypto from 'crypto';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { prisma } from '../db.js';

import { ok, failure } from '../utils/SendResponse.util.js';

import { Event } from '../events/Event.js';

export const AuthService = {
    register: async (payload) => {
        const user = await AuthService.getUserbyEmail(payload.email);

        if (user) return failure('User already exists. Please login', 400);

        const newUser = await AuthService.createUser(payload);

        const token = AuthService.createToken(newUser);

        return ok({ token }, 201);
    },

    login: async (payload) => {
        const user = await AuthService.getUserbyEmail(payload.email);
        let isPasswordCorrect;

        if (user) isPasswordCorrect = await AuthService.correctPassword(payload.password, user.password);

        if (!user || !isPasswordCorrect) return failure('Incorrect email or password', 400);

        const token = AuthService.createToken(user);

        return ok({ token });
    },

    forgotPassword: async (email, protocol, host) => {
        const user = await AuthService.getUserbyEmail(email);

        if (!user) return failure('No user found with that email');

        const resetToken = await AuthService.createPasswordResetToken(user.email);

        const resetURL = `${protocol}://${host}/api/auth/reset-password/${resetToken}`;

        const message = `<h1>Forgot your password?</h1>
            <p>Submit a PATCH request with your new password <a href="${resetURL}">HERE</a>. 
            <br>If you didn't forget your password, please ignore this email!</p>`;

        try {
            await Event.emit('sendEmail', {
                email: user.email,
                subject: 'Your password reset token (valid for 10 min)',
                message,
            });

            return ok({ message: 'Token sent to email' });
        } catch (err) {
            await AuthService.updateUserForResetPassword(user.email, null, null);

            return failure('There was an error sending the email. Try again later!', 500);
        }
    },

    resetPassword: async (resetToken, password) => {
        const user = await AuthService.getUserByResetToken(resetToken);

        if (!user) return failure('Token is invalid or has expired!', 400);

        await AuthService.updateUserPassword(user.id, password);

        const token = AuthService.createToken(user);

        return ok({ token });
    },

    logout: () => {
        return ok({ message: 'You have been Logged Out', token: null });
    },

    createUser: async (payload) => {
        const encryptedPassword = await bcrypt.hash(payload.password, 12);

        const { email, fullName, birthDate, education } = payload;

        const newUser = await prisma.user.create({
            data: {
                email: email.toLowerCase(),
                fullName,
                password: encryptedPassword,
                birthDate: new Date(birthDate).toISOString(),
                education,
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
            },
        });

        return newUser;
    },

    getUserbyEmail: async (email) => {
        return prisma.user.findUnique({
            where: {
                email,
            },
            select: {
                id: true,
                email: true,
                password: true,
                role: true,
            },
        });
    },

    createToken: (user) => {
        const userId = user.id;
        const userRole = user.role;
        const token = jwt.sign({ userId, userRole }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        return token;
    },

    correctPassword: async (candidatePassword, userPassword) => {
        return bcrypt.compare(candidatePassword, userPassword);
    },

    createPasswordResetToken: async (userEmail) => {
        const resetToken = crypto.randomBytes(32).toString('hex');

        const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

        await AuthService.updateUserForResetPassword(userEmail, passwordResetToken, passwordResetExpires);

        return resetToken;
    },

    updateUserForResetPassword: async (userEmail, passwordResetToken, passwordResetExpires) => {
        await prisma.user.update({
            where: {
                email: userEmail,
            },
            data: {
                passwordResetToken,
                passwordResetExpires,
            },
        });
    },

    getUserByResetToken: async (passwordResetToken) => {
        const hashedPassword = crypto.createHash('sha256').update(passwordResetToken).digest('hex');

        const user = await prisma.user.findFirst({
            where: {
                passwordResetToken: hashedPassword,
                passwordResetExpires: {
                    gt: new Date(),
                },
            },
            select: {
                id: true,
                role: true,
            },
        });

        return user;
    },

    updateUserPassword: async (userId, password) => {
        const encryptedPassword = await bcrypt.hash(password, 12);

        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                password: encryptedPassword,
                passwordResetToken: null,
                passwordResetExpires: null,
            },
        });
    },
};
