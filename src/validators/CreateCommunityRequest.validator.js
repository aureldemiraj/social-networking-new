import Joi from 'joi';

export const CreateCommunityRequest = Joi.object({
    name: Joi
        .string()
        .trim()
        .required(),

    description: Joi
        .string()
        .trim()
        .required(),
});