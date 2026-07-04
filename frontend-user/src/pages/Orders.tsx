import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import type { Order } from "../types/order";
import {
  formatDate,
  formatPrice,
} from "../utils/format";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get<Order[]>("/orders/my-orders");
        setOrders(res.data);
      } catch {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    void fetchOrders();
  }, []);
  
  const BACKEND_URL = "http://localhost:5000"; // Replace with your actual backend URL

  // 🟢 Helper function to correctly format locally hosted or external absolute image strings
  const getProductImageUrl = (imagePath?: string) => {
    if (!imagePath) return "https://placehold.co/120x120?text=No+Image";
    if (imagePath.startsWith("/uploads")) {
      return `${BACKEND_URL}${imagePath}`;
    }
    return imagePath;
  };

  return (
    <section className="container-custom py-10 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-10">
        My Orders
      </h1>

      {loading ? (
        <div className="space-y-5">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="skeleton h-48 rounded-2xl"
            />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold">
            No orders yet
          </h2>
          <Link
            to="/"
            className="btn-primary inline-block mt-6"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <article
              key={order._id}
              className="bg-white rounded-2xl p-5 md:p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-5">
                <div>
                  <p className="text-sm text-gray-500">
                    Order #{order._id}
                  </p>
                  <h2 className="text-xl font-bold mt-1">
                    {formatPrice(order.totalAmount)}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="rounded-full bg-gray-100 px-4 py-2">
                    {formatDate(order.createdAt)}
                  </span>
                  <span className="rounded-full bg-black text-white px-4 py-2">
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="grid gap-4 mt-5">
                {order.items.map((item) => (
                  <div
                    key={`${order._id}-${item.product}`}
                    className="flex gap-4"
                  >
                    {/* 🟢 FIXED: Wrapped image resolution with absolute fallback helper safety */}
                    <img
                      src={getProductImageUrl(item.image)}
                      alt={item.title}
                      className="w-20 h-20 rounded-xl object-cover bg-gray-100 border"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Orders;