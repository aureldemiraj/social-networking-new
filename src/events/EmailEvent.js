import { Event } from './Event.js';

import { sendEmail } from '../utils/Email.util.js';

export const EmailEvent = Event.on('sendEmail', async (obj) => {
    await sendEmail(obj);
});
