import Joi from 'joi';

export const ForgotPasswordRequest = Joi.object({
    email: Joi
        .string()
        .trim()
        .email()
        .required(),
});