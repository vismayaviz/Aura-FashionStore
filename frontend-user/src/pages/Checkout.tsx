import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useShop } from "../hooks/useShop";
import type { ShippingAddress } from "../types/cart";
import type { Order } from "../types/order";
import { formatPrice } from "../utils/format";

const initialAddress: ShippingAddress = {
  fullName: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
};

const Checkout = () => {
  const navigate = useNavigate();
  const {
    cart,
    cartLoading,
    refreshCart,
  } = useShop();
  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddress>(initialAddress);
  const [submitting, setSubmitting] = useState(false);

  const items = cart?.items ?? [];
  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      item.product.price * item.quantity,
    0
  );

  const updateField = (
    field: keyof ShippingAddress,
    value: string
  ) => {
    setShippingAddress((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (items.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    try {
      setSubmitting(true);
      await api.post<Order>("/orders", {
        shippingAddress,
      });
      await refreshCart();
      toast.success("Order placed");
      navigate("/orders");
    } catch {
      toast.error("Could not place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (cartLoading) {
    return (
      <section className="container-custom py-10 md:py-16">
        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          <div className="skeleton h-[560px] rounded-2xl" />
          <div className="skeleton h-80 rounded-2xl" />
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="container-custom py-20 text-center">
        <h1 className="text-3xl font-bold">
          Your cart is empty
        </h1>
        <Link
          to="/"
          className="btn-primary inline-block mt-6"
        >
          Continue Shopping
        </Link>
      </section>
    );
  }

  const BACKEND_URL = "http://localhost:5000"; // Replace with your actual backend URL

  // 🟢 Helper function to correctly format locally hosted or external absolute image URLs
  const getProductImageUrl = (imagePath?: string) => {
    if (!imagePath) return "https://placehold.co/60x60?text=No+Image";
    if (imagePath.startsWith("/uploads")) {
      return `${BACKEND_URL}${imagePath}`;
    }
    return imagePath;
  };

  return (
    <section className="container-custom py-10 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-10">
        Checkout
      </h1>

      <form
        onSubmit={(event) => void handleSubmit(event)}
        className="grid lg:grid-cols-[1fr_360px] gap-8 items-start"
      >
        <div className="bg-white rounded-2xl p-5 md:p-8">
          <h2 className="text-2xl font-bold mb-6">
            Shipping Address
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <input
              required
              value={shippingAddress.fullName}
              onChange={(event) =>
                updateField("fullName", event.target.value)
              }
              className="input-field"
              placeholder="Full name"
            />
            <input
              required
              value={shippingAddress.phone}
              onChange={(event) =>
                updateField("phone", event.target.value)
              }
              className="input-field"
              placeholder="Phone"
            />
            <input
              required
              value={shippingAddress.address}
              onChange={(event) =>
                updateField("address", event.target.value)
              }
              className="input-field sm:col-span-2"
              placeholder="Address"
            />
            <input
              required
              value={shippingAddress.city}
              onChange={(event) =>
                updateField("city", event.target.value)
              }
              className="input-field"
              placeholder="City"
            />
            <input
              required
              value={shippingAddress.state}
              onChange={(event) =>
                updateField("state", event.target.value)
              }
              className="input-field"
              placeholder="State"
            />
            <input
              required
              value={shippingAddress.postalCode}
              onChange={(event) =>
                updateField("postalCode", event.target.value)
              }
              className="input-field"
              placeholder="Postal code"
            />
            <input
              required
              value={shippingAddress.country}
              onChange={(event) =>
                updateField("country", event.target.value)
              }
              className="input-field"
              placeholder="Country"
            />
          </div>
        </div>

        <aside className="bg-white rounded-2xl p-6 sticky top-24">
          <h2 className="text-xl font-bold mb-6">
            Review Order
          </h2>
          <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
            {items.map((item) => (
              <div
                key={item.product._id}
                className="flex gap-3"
              >
                {/* 🟢 FIXED: Wrapped image target query inside format helper string function */}
                <img
                  src={getProductImageUrl(item.product.images?.[0])}
                  alt={item.product.title}
                  className="w-16 h-16 rounded-lg object-cover bg-gray-100 border"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {item.product.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold">
                  {formatPrice(
                    item.product.price *
                      item.quantity
                  )}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t mt-6 pt-6 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>
              {formatPrice(subtotal)}
            </span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full mt-6 disabled:opacity-50"
          >
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
        </aside>
      </form>
    </section>
  );
};

export default Checkout;