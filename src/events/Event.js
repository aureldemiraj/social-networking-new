import awaitEventEmitter from 'await-event-emitter';

const EventEmitter = awaitEventEmitter.default;

export const Event = new EventEmitter();
