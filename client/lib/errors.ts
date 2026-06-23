import { isAxiosError } from "axios";

type ApiErrorResponse = {
    message?: string;
    error?: Array<{ message?: string }>;
};

export const getApiErrorMessage = (error: unknown, fallback = "Something went wrong") => {
    if (isAxiosError<ApiErrorResponse>(error)) {
        return error.response?.data?.message
            ?? error.response?.data?.error?.[0]?.message
            ?? fallback;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return fallback;
};
