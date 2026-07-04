export const StateBlock = ({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "error";
  children: string;
}) => (
  <div
    className={
      tone === "error"
        ? "rounded-3xl border border-rose-200 bg-rose-50 p-8 text-sm text-rose-700"
        : "rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center text-slate-500"
    }
  >
    {children}
  </div>
);
