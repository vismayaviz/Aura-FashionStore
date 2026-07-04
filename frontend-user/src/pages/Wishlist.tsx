import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ShoppingBag, Trash2 } from "lucide-react";
import { useShop } from "../hooks/useShop";
import { formatPrice } from "../utils/format";

const Wishlist = () => {
  const {
    wishlist,
    wishlistLoading,
    removeFromWishlist,
    addToCart,
  } = useShop();

  const products = wishlist?.products ?? [];

  const handleRemove = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
      toast.success("Removed from wishlist");
    } catch {
      toast.error("Could not remove item");
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId, 1);
      toast.success("Added to cart");
    } catch {
      toast.error("Could not add item");
    }
  };

  const BACKEND_URL = "http://localhost:5000"; // Replace with your actual backend URL

  // 🟢 Reusable image helper with explicit fallback logic for empty arrays
  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return "https://placehold.co/600x400?text=No+Image";
    if (imagePath.startsWith("/uploads")) {
      return `${BACKEND_URL}${imagePath}`;
    }
    return imagePath;
  };

  return (
    <section className="container-custom py-10 md:py-16">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">My Wishlist</h1>
          <p className="text-gray-500 mt-2">
            Save favorites and move them to cart when ready.
          </p>
        </div>
        <Link to="/" className="btn-outline text-center">
          Continue Shopping
        </Link>
      </div>

      {wishlistLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="skeleton h-96 rounded-2xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold">No wishlist items yet</h2>
          <Link to="/" className="btn-primary inline-block mt-6">
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm"
            >
              {/* 🟢 FIXED: Wrapped inside the Link tag context, removed duplicate tag block, added base image resolver helper */}
              <Link to={`/product/${product._id}`}>
                <img
                  src={getImageUrl(product.images?.[0])}
                  alt={product.title}
                  className="w-full h-64 object-cover bg-gray-100"
                />
              </Link>
              <div className="p-5">
                <h3 className="font-semibold truncate">{product.title}</h3>
                <p className="font-bold mt-2">{formatPrice(product.price)}</p>
                <div className="grid grid-cols-2 gap-3 mt-5">
                  <button
                    type="button"
                    onClick={() => void handleAddToCart(product._id)}
                    className="btn-primary flex items-center justify-center gap-2 px-3"
                  >
                    <ShoppingBag size={16} />
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleRemove(product._id)}
                    className="btn-outline flex items-center justify-center gap-2 px-3"
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Wishlist;