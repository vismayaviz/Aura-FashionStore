import { isAxiosError } from "axios";

interface ApiErrorBody {
  message?: string;
}

export const getErrorMessage = (
  error: unknown,
  fallback: string
) => {
  if (isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.message ?? error.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};
