import Joi from 'joi';

const schema = Joi.object({
    email: Joi
        .string()
        .trim()
        .email()
        .required(),

    password: Joi
        .string()
        .trim()
        .min(8)
        .required(),
});

export default schema