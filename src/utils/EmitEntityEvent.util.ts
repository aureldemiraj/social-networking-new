import { io } from '../app';

export const EmitEntityEvent = (action: string, entity: string, data: object) => {
    io.emit(`${action}${entity}`, data);
};
