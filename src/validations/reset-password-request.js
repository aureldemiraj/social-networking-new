import Joi from 'joi';

const schema = Joi.object({
    password: Joi
        .string()
        .trim()
        .min(8)
        .required(),
});

export default schema