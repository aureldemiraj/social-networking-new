import { app } from './app';

import { port } from './config/app.config';

app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
