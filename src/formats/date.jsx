export const formatDate = (value) => {
    const date = new Date(value);

    if (isNaN(date.getTime())) return value;

    return date.toLocaleString("en-PH", {
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const formatDateOnly = (value) => {
    const date = new Date(value);

    if (isNaN(date.getTime())) return value;

    return date.toLocaleString("en-PH", {
        year: "numeric",
        month: "long",
        day: "2-digit",
    });
};

export const formatTimeOnly = (value) => {
    const date = new Date(value);

    if (isNaN(date.getTime())) return value;

    return date.toLocaleString("en-PH", {
        hour: "2-digit",
        minute: "2-digit",
    });
};