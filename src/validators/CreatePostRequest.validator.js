import Joi from 'joi';

export const CreatePostRequest = Joi.object({
    title: Joi
        .string()
        .trim()
        .required(),

    body: Joi
        .string()
        .trim()
        .required(),
});