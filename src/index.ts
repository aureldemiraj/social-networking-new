import dotenv from 'dotenv';
dotenv.config();

import { app } from './app';

import { PORT } from './config/app.config';

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}...`);
});

export default app;
