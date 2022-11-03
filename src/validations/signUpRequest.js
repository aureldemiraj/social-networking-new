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

    fullName: Joi
        .string()
        .trim()
        .required(),

    birthDate: Joi
        .date()
        .required(),

    education: Joi
        .string()
        .trim(),
});

export default schema