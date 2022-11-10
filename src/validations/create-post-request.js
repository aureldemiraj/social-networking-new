import Joi from 'joi';

const schema = Joi.object({
    title: Joi
        .string()
        .trim()
        .required(),

    body: Joi
        .string()
        .trim()
        .required(),
});

export default schema