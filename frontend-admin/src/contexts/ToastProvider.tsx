import { useCallback, useState } from "react";
import type { ReactNode } from "react";
import { ToastContext } from "./ToastContext";
import type { ToastMessage } from "./ToastContext";
import { ToastViewport } from "../components/ui/ToastViewport";

export const ToastProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) =>
      current.filter((toast) => toast.id !== id)
    );
  }, []);

  const showToast = useCallback(
    (message: Omit<ToastMessage, "id">) => {
      const id = crypto.randomUUID();
      setToasts((current) => [
        ...current,
        {
          id,
          ...message,
        },
      ]);

      window.setTimeout(() => dismissToast(id), 4200);
    },
    [dismissToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastViewport
        toasts={toasts}
        onDismiss={dismissToast}
      />
    </ToastContext.Provider>
  );
};
