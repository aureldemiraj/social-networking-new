import { Request } from 'express';

export interface DataStoredInToken {
    userId: string;
    userRole: string;
}

export interface RequestWithData extends Request {
    userId: string;
    userRole: string;
}
