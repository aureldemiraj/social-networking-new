import Joi from 'joi';

const schema = Joi.object({
    name: Joi
        .string()
        .trim()
        .required(),

    description: Joi
        .string()
        .trim()
        .required(),
});

export default schema