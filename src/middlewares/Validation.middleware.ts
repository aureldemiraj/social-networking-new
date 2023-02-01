import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { AppError } from '../utils/AppError.util';

export function validate(schema: Joi.ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        const validationResult = schema.validate(req.body);

        if (validationResult.error) {
            throw new AppError(validationResult.error.message, 400);
        }

        next();
    };
}
