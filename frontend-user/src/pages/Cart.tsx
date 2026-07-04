import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useShop } from "../hooks/useShop";
import { formatPrice } from "../utils/format";

const Cart = () => {
  const {
    cart,
    cartLoading,
    updateCartQuantity,
    removeFromCart,
  } = useShop();

  const items = cart?.items ?? [];
  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      (item.product?.price ?? 0) * item.quantity,
    0
  );

  const handleQuantity = async (
    productId: string,
    quantity: number
  ) => {
    try {
      await updateCartQuantity(
        productId,
        quantity
      );
    } catch {
      toast.error(
        "Could not update cart"
      );
    }
  };

  const handleRemove = async (
    productId: string
  ) => {
    try {
      await removeFromCart(productId);
      toast.success("Removed from cart");
    } catch {
      toast.error(
        "Could not remove item"
      );
    }
  };

  const BACKEND_URL = "http://localhost:5000"; // Replace with your actual backend URL

  // 🟢 Helper function to correctly format locally hosted or external image strings
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
        Shopping Cart
      </h1>

      {cartLoading ? (
        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="skeleton h-32 rounded-2xl"
              />
            ))}
          </div>
          <div className="skeleton h-64 rounded-2xl" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold">
            Your cart is empty
          </h2>
          <Link
            to="/"
            className="btn-primary inline-block mt-6"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.product._id}
                className="bg-white rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row gap-4"
              >
                {/* 🟢 FIXED: Image src now safely runs through the route resolver logic */}
                <img
                  src={getProductImageUrl(item.product?.images?.[0])}
                  alt={item.product.title}
                  className="w-20 h-20 rounded-xl object-cover bg-gray-100 border"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${item.product._id}`}
                    className="font-semibold text-lg"
                  >
                    {item.product.title}
                  </Link>
                  <p className="text-gray-500 mt-1">
                    {formatPrice(item.product.price)}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-5">
                    <div className="flex items-center border rounded-lg overflow-hidden">
                      <button
                        type="button"
                        className="p-3"
                        onClick={() =>
                          void handleQuantity(
                            item.product._id,
                            item.quantity - 1
                          )
                        }
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 py-2 border-x">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="p-3"
                        onClick={() =>
                          void handleQuantity(
                            item.product._id,
                            item.quantity + 1
                          )
                        }
                        disabled={
                          item.quantity >=
                          item.product.stock
                        }
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        void handleRemove(
                          item.product._id
                        )
                      }
                      className="text-red-600 flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                </div>
                <p className="font-bold text-lg">
                  {formatPrice(
                    item.product.price *
                      item.quantity
                  )}
                </p>
              </div>
            ))}
          </div>

          <aside className="bg-white rounded-2xl p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">
              Order Summary
            </h2>
            <div className="space-y-4 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            <div className="border-t mt-6 pt-6 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>
                {formatPrice(subtotal)}
              </span>
            </div>
            <Link
              to="/checkout"
              className="btn-primary block text-center mt-6"
            >
              Proceed to Checkout
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
};

export default Cart;