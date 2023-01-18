import { AuthController } from './controllers/Auth.controller.js';
import { CommunityController } from './controllers/Community.controller.js';
import { EventController } from './controllers/Event.controller.js';
import { MeController } from './controllers/Me.controller.js';
import { PostController } from './controllers/Post.controller.js';
import { UserController } from './controllers/User.controller.js';

import { Express, Router } from 'express';

export function routes(app: Express) {
    const _routes: [string, Router][] = [
        ['communities', CommunityController],
        ['users', UserController],
        ['events', EventController],
        ['posts', PostController],
        ['auth', AuthController],
        ['me', MeController],
    ];

    _routes.forEach((item) => {
        const [route, controller] = item;
        app.use(`/api/${route}`, controller);
    });
}
