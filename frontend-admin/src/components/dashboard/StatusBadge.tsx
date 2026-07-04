import type { OrderStatus } from "../../types/order";

export const StatusBadge = ({
  status,
}: {
  status: OrderStatus;
}) => {
  const palette: Record<OrderStatus, string> = {
    Pending: "bg-amber-100 text-amber-700",
    Processing: "bg-sky-100 text-sky-700",
    Shipped: "bg-blue-100 text-blue-700",
    Delivered: "bg-emerald-100 text-emerald-700",
    Cancelled: "bg-rose-100 text-rose-700",
  };

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${palette[status]}`}>
      {status}
    </span>
  );
};
