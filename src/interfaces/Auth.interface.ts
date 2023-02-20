import { Request } from 'express';

export interface TokenPayload {
    userId: string;
    userRole: string;
}

export interface RequestWithData extends Request {
    userId: string;
    userRole: string;
}
