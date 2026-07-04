import type { ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useAuth } from "../../hooks/useAuth";

export const PageShell = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-5 px-3 py-4 sm:px-5 lg:flex-row lg:gap-6 lg:px-8">
        <Sidebar onLogout={logout} />
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <Header user={user} />
          <main className="flex-1 px-0 pb-6 sm:px-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
