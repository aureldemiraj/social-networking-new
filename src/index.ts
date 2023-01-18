import { app } from './app';

import dotenv from 'dotenv';
dotenv.config();

import { PORT } from './config/app.config';

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}...`);
});
