import type { AuthUser } from "../../types/user";
import { UserCircle2 } from "lucide-react";

export const Header = ({ user }: { user: AuthUser | null }) => (
  <header className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 px-5 py-5 shadow-sm shadow-slate-200/40 backdrop-blur-lg sm:flex-row sm:items-center sm:justify-between sm:px-8">
    <div>
      <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Welcome back</p>
      <h2 className="text-2xl font-semibold text-slate-950">Admin Dashboard</h2>
    </div>
    <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 shadow-sm">
      <UserCircle2 className="h-6 w-6 text-slate-500" />
      <div>
        <p className="text-sm font-semibold text-slate-900">{user?.name ?? "Admin"}</p>
        <p className="text-xs text-slate-500">{user?.email ?? "admin@example.com"}</p>
      </div>
    </div>
  </header>
);
