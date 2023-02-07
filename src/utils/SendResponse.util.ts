export const ok = (data: Object, status = 200) => {
    return {
        status,
        data,
    };
};

export const failure = (message: string, status = 400) => ({
    status,
    data: {
        message,
    },
});
