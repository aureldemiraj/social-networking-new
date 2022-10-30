
export const checkEventRequest = (payload) => {
    return payload.name && payload.description && payload.location && payload.eventTime
}