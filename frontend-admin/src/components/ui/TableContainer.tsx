import type { ReactNode } from "react";

export const TableContainer = ({
  children,
}: {
  children: ReactNode;
}) => (
  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40">
    <div className="overflow-x-auto">{children}</div>
  </div>
);
