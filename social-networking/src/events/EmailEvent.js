import { sendEmail } from '../utils/Email.util.js';
import { Event } from './Event.js';

export const EmailEvent = Event.on('sendEmail', async (obj) => {
    await sendEmail(obj);
});
