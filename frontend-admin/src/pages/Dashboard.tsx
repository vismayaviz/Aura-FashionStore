import { useEffect, useState } from "react";
import { dashboardService } from "../services/dashboardService";
import { MetricCard } from "../components/dashboard/MetricCard";
import { StatusBadge } from "../components/dashboard/StatusBadge";
import { StateBlock } from "../components/ui/StateBlock";
import { getErrorMessage } from "../utils/apiError";
import type { OrderItemResponse } from "../types/order";
import { orderService } from "../services/orderService";

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
  });
  const [recentOrders, setRecentOrders] = useState<OrderItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsResponse, ordersResponse] = await Promise.all([
          dashboardService.getStats(),
          orderService.getAll(),
        ]);

        setStats(statsResponse);
        setRecentOrders(ordersResponse.slice(0, 5));
      } catch (err) {
        setError(getErrorMessage(err, "Unable to load dashboard"));
      } finally {
        setLoading(false);
      }
    };

    void fetchAll();
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid gap-6 xl:grid-cols-4 lg:grid-cols-2">
        <MetricCard title="Total Products" value={stats.totalProducts} />
        <MetricCard title="Total Orders" value={stats.totalOrders} />
        <MetricCard title="Total Users" value={stats.totalUsers} />
        <MetricCard
          title="Total Sales"
          value={`$${stats.totalSales.toFixed(2)}`}
        />
      </div>

      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Recent activity</p>
            <h3 className="text-xl font-semibold text-slate-950">Recent orders</h3>
          </div>
        </div>

        {loading ? (
          <StateBlock>Loading recent orders...</StateBlock>
        ) : error ? (
          <StateBlock tone="error">{error}</StateBlock>
        ) : recentOrders.length === 0 ? (
          <StateBlock>No recent orders available.</StateBlock>
        ) : (
          <div className="grid gap-4">
            {recentOrders.map((order) => (
              <div key={order._id} className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Order ID</p>
                    <p className="mt-2 text-base font-semibold text-slate-950">{order._id}</p>
                  </div>
                  <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-3 sm:items-center">
                  <div>
                    <p className="text-sm text-slate-500">Customer</p>
                    <p className="mt-1 font-semibold text-slate-900">{order.user?.name || "Guest/Deleted User"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Total</p>
                    <p className="mt-1 font-semibold text-slate-900">${order.totalAmount.toFixed(2)}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
