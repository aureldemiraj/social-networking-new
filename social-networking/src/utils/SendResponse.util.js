export const ok = (data, status = 200) => {
    return {
        status,
        data,
    };
};

export const failure = (message, status = 404) => ({
    status,
    data: {
        message,
    },
});
