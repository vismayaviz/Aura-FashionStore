import { createContext } from "react";

export type ToastVariant = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

export interface ToastContextValue {
  showToast: (
    message: Omit<ToastMessage, "id">
  ) => void;
}

export const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});
