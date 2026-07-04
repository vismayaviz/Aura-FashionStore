import { NavLink } from "react-router-dom";
import {
  Home,
  Box,
  Layers,
  Users,
  ShoppingBag,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", to: "/", icon: Home },
  { label: "Products", to: "/products", icon: Box },
  { label: "Categories", to: "/categories", icon: Layers },
  { label: "Orders", to: "/orders", icon: ShoppingBag },
  { label: "Users", to: "/users", icon: Users },
];

export const Sidebar = ({
  onLogout,
}: {
  onLogout: () => void;
}) => (
  <aside className="sticky top-4 z-20 flex w-full flex-col gap-4 rounded-3xl bg-slate-950/95 px-4 py-4 text-slate-100 shadow-xl shadow-slate-900/10 lg:h-[calc(100vh-2rem)] lg:max-w-[280px] lg:gap-6 lg:px-5 lg:py-6">
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-800 text-slate-100 shadow-inner shadow-slate-900/20">
        A
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">AURA</p>
        <h1 className="text-lg font-semibold text-white">Admin Panel</h1>
      </div>
    </div>

    <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-1 lg:flex-col lg:overflow-visible lg:pb-0">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-slate-100 text-slate-950 shadow"
                  : "text-slate-300 hover:bg-slate-900/80 hover:text-white"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        );
      })}
    </nav>

    <button
      type="button"
      onClick={onLogout}
      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-700 lg:mt-auto"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </button>
  </aside>
);
