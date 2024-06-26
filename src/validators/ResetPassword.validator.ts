import Joi from 'joi';

export const ResetPasswordValidator = Joi.object({
    password: Joi.string().trim().min(8).required(),
});
