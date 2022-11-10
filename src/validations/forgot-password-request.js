import Joi from 'joi';

const schema = Joi.object({
    email: Joi
        .string()
        .trim()
        .email()
        .required(),
});

export default schema