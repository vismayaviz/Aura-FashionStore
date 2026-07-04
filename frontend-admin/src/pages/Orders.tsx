import { useEffect, useState } from "react";
import { orderService } from "../services/orderService";
import { StatusBadge } from "../components/dashboard/StatusBadge";
import { StateBlock } from "../components/ui/StateBlock";
import { TableContainer } from "../components/ui/TableContainer";
import { getErrorMessage } from "../utils/apiError";
import { useToast } from "../hooks/useToast";
import type { OrderItemResponse, OrderStatus } from "../types/order";

const statusOptions: OrderStatus[] = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export const Orders = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<OrderItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setOrders(await orderService.getAll());
      } catch (err) {
        setError(getErrorMessage(err, "Unable to load orders"));
      } finally {
        setLoading(false);
      }
    };

    void loadOrders();
  }, []);

  const handleStatusChange = async (
    orderId: string,
    status: OrderStatus
  ) => {
    try {
      const updated = await orderService.updateStatus(orderId, status);
      setOrders((current) =>
        current.map((order) =>
          order._id === updated._id
            ? {
                ...order,
                status: updated.status,
                updatedAt: updated.updatedAt,
              }
            : order
        )
      );
      showToast({
        title: "Order status updated",
        description: `Order ${orderId} is now ${updated.status}.`,
        variant: "success",
      });
    } catch (err) {
      const message = getErrorMessage(err, "Unable to update status");
      setError(message);
      showToast({
        title: "Status update failed",
        description: message,
        variant: "error",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-slate-200 bg-white px-6 py-6 shadow-sm shadow-slate-200/40">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Order management</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Orders</h2>
        </div>
      </div>

      {loading ? (
        <StateBlock>Loading orders...</StateBlock>
      ) : error ? (
        <StateBlock tone="error">{error}</StateBlock>
      ) : orders.length === 0 ? (
        <StateBlock>No orders available.</StateBlock>
      ) : (
        <TableContainer>
          <table className="min-w-full border-collapse text-left text-slate-700">
            <thead className="bg-slate-50 text-sm uppercase tracking-[0.24em] text-slate-500">
              <tr>
                <th className="px-4 py-4">Order</th>
                <th className="px-4 py-4">Customer</th>
                <th className="px-4 py-4">Amount</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-slate-200 last:border-none">
                  <td className="px-4 py-4 text-sm text-slate-700">
                    <div className="font-semibold text-slate-900">{order._id}</div>
                    <div className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">{order.user?.name || "Deleted User"}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">${order.totalAmount.toFixed(2)}</td>
                  <td className="px-4 py-4 text-sm text-slate-700"><StatusBadge status={order.status} /></td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    <div className="w-44">
  <select
    value={order.status}
    onChange={(e) =>
      handleStatusChange(
        order._id,
        e.target.value as OrderStatus
      )
    }
    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
  >
    {statusOptions.map((status) => (
      <option key={status} value={status}>
        {status}
      </option>
    ))}
  </select>
</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      )}
    </div>
  );
};
