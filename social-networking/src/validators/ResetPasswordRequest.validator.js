import Joi from 'joi';

export const ResetPasswordRequest = Joi.object({
    password: Joi
        .string()
        .trim()
        .min(8)
        .required(),
});