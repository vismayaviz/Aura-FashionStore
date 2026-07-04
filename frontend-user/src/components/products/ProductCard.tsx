import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import { useShop } from "../../hooks/useShop";
import { formatPrice } from "../../utils/format";

interface Props {
  product: Product;
}

// 🟢 Point this to your actual backend server URL (e.g., http://localhost:5000)
const API_BASE_URL = "http://localhost:5000"; 

const ProductCard = ({ product }: Props) => {
  const {
    addToWishlist,
    removeFromWishlist,
    isWishlisted,
  } = useShop();

  const wishlisted = isWishlisted(product._id);

  const handleWishlist = async () => {
    try {
      if (wishlisted) {
        await removeFromWishlist(product._id);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(product._id);
        toast.success("Added to wishlist");
      }
    } catch {
      toast.error("Could not update wishlist");
    }
  };

  // 🟢 Helper function to correctly format locally hosted image URLs
  const getProductImageUrl = (imagePath?: string) => {
    if (!imagePath) return "https://placehold.co/600x400?text=No+Image";
    // If it's a relative upload path, prefix it with the backend server base URL
    if (imagePath.startsWith("/uploads")) {
      return `${API_BASE_URL}${imagePath}`;
    }
    return imagePath; // Return as-is if it's already an absolute web URL string
  };

  return (
    <div className="group bg-white rounded-[2rem] overflow-hidden shadow-luxury transition duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <Link to={`/product/${product._id}`}>
          <img
            // 🟢 FIXED: Wrapped the image array lookups into the base URL resolver helper
            src={getProductImageUrl(product.images?.[0])}
            alt={product.title}
            className="w-full h-72 object-cover transition duration-500 group-hover:scale-105 bg-gray-100"
          />
        </Link>

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />

        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 opacity-0 group-hover:opacity-100 transition duration-300">
          <Link
            to={`/product/${product._id}`}
            className="btn-outline text-xs sm:text-sm"
          >
            Quick View
          </Link>
          <button
            type="button"
            onClick={() => void handleWishlist()}
            className="rounded-full bg-white/90 p-2 shadow"
            aria-label="Toggle wishlist"
          >
            <Heart
              size={18}
              fill={wishlisted ? "currentColor" : "none"}
              className={wishlisted ? "text-red-600" : "text-gray-700"}
            />
          </button>
        </div>
      </div>

      <div className="p-5">
        <span className="text-xs uppercase tracking-[0.2em] text-gray-500">
          {product.category?.name || "Uncategorized"}
        </span>
        <h3 className="font-semibold text-lg mt-3 truncate">
          {product.title}
        </h3>
        <p className="text-gray-500 text-sm mt-3 line-clamp-2 min-h-[44px]">
          {product.description}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="font-semibold text-xl text-gray-900">
            {formatPrice(product.price)}
          </span>
          <Link
            to={`/product/${product._id}`}
            className="btn-primary px-4 py-2 text-sm"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;