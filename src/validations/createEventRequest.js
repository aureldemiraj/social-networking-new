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

    location: Joi
        .string()
        .trim()
        .required(),

    eventTime: Joi
        .date()
        .required()
        .min('now')
        .messages({
            'date.min': 'The event date should be in the future'
        }),
});

export default schema