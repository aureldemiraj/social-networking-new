import { AuthController } from './controllers/Auth.controller';
import { CommunityController } from './controllers/Community.controller';
import { EventController } from './controllers/Event.controller';
import { MeController } from './controllers/Me.controller';
import { PostController } from './controllers/Post.controller';
import { UserController } from './controllers/User.controller';

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
