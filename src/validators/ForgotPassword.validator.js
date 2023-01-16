import Joi from 'joi';

export const ForgotPasswordValidator = Joi.object({
    email: Joi.string().trim().email().required(),
});
