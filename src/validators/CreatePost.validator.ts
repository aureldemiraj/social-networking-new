import Joi from 'joi';

export const CreatePostValidator = Joi.object({
    title: Joi.string().trim().required(),

    body: Joi.string().trim().required(),
});
