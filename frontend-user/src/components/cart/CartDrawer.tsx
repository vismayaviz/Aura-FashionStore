import { Link } from "react-router-dom";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useShop } from "../../hooks/useShop";
import { formatPrice } from "../../utils/format";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = ({
  open,
  onClose,
}: Props) => {
  const {
    cart,
    cartLoading,
    removeFromCart,
  } = useShop();

  if (!open) return null;

  const items = cart?.items ?? [];

  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      item.product.price * item.quantity,
    0
  );

  const handleRemove = async (
    productId: string
  ) => {
    try {
      await removeFromCart(productId);
      toast.success("Removed from cart");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const BACKEND_URL = "http://localhost:5000"; // Replace with your actual backend URL
  return (
    <div className="fixed inset-0 bg-black/40 z-50">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-label="Close cart"
      />

      <aside className="absolute right-0 top-0 h-full w-full max-w-[420px] bg-white p-5 sm:p-6 overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">
            Cart
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
          >
            <X size={22} />
          </button>
        </div>

        {cartLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="skeleton h-24 rounded-xl"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg font-semibold">
              Your cart is empty
            </p>
            <Link
              to="/"
              onClick={onClose}
              className="btn-primary inline-block mt-6"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-5">
              {items.map((item) => (
                <div
                  key={item.product._id}
                  className="flex gap-4"
                >
                  <img
  src={
    item.product.images?.length
      ? `${BACKEND_URL}${item.product.images[0]}`
      : "/placeholder.png"
  }
                    alt={item.product.title}
                    className="w-20 h-20 object-cover rounded-xl bg-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">
                      {item.product.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                    <p className="font-semibold mt-1">
                      {formatPrice(
                        item.product.price *
                          item.quantity
                      )}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        void handleRemove(
                          item.product._id
                        )
                      }
                      className="text-sm text-red-600 mt-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t mt-8 pt-6">
              <div className="flex justify-between font-bold text-lg">
                <span>Subtotal</span>
                <span>
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="grid gap-3 mt-6">
                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="btn-primary text-center"
                >
                  Checkout
                </Link>
                <Link
                  to="/cart"
                  onClick={onClose}
                  className="btn-outline text-center"
                >
                  View Cart
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
};

export default CartDrawer;
