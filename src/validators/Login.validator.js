import Joi from 'joi';

export const LoginValidator = Joi.object({
    email: Joi.string().trim().email().required(),

    password: Joi.string().trim().min(8).required(),
});
