import Joi from 'joi';

export const CreateCommunityValidator = Joi.object({
    name: Joi.string().trim().required(),

    description: Joi.string().trim().required(),
});
