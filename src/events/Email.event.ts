import { Event } from './Events';

import { sendEmail } from '../utils/Email.util';

export const EmailEvent = Event.on('sendEmail', async (obj: Email) => {
    await sendEmail(obj);
});
