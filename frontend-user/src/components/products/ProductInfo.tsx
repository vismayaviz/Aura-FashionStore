import { Heart, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import type { Product } from "../../types/product";
import { useShop } from "../../hooks/useShop";
import { formatPrice } from "../../utils/format";

interface Props {
  product: Product;
}

const ProductInfo = ({
  product,
}: Props) => {
  const {
    addToCart,
    addToWishlist,
    removeFromWishlist,
    isWishlisted,
  } = useShop();

  const [quantity, setQuantity] =
    useState(1);
  const [submitting, setSubmitting] =
    useState(false);

  const wishlisted = isWishlisted(
    product._id
  );

  const handleAddToCart = async () => {
    try {
      setSubmitting(true);
      await addToCart(
        product._id,
        quantity
      );
      toast.success("Added to cart");
    } catch {
      toast.error("Failed to add item");
    } finally {
      setSubmitting(false);
    }
  };

  const handleWishlist = async () => {
    try {
      if (wishlisted) {
        await removeFromWishlist(
          product._id
        );
        toast.success(
          "Removed from wishlist"
        );
      } else {
        await addToWishlist(product._id);
        toast.success(
          "Added to wishlist"
        );
      }
    } catch {
      toast.error(
        "Could not update wishlist"
      );
    }
  };

  return (
    <div>
      <p className="text-sm uppercase tracking-[3px] text-gray-500 mb-3">
        {product.category?.name}
      </p>
      <h1 className="text-3xl md:text-5xl font-bold mb-4">
        {product.title}
      </h1>
      <p className="text-2xl md:text-3xl font-bold mb-6">
        {formatPrice(product.price)}
      </p>
      <p className="text-gray-600 mb-8 leading-7">
        {product.description}
      </p>

      <div className="mb-8 flex flex-wrap gap-4 text-sm">
        <span className="rounded-full bg-white px-4 py-2 border">
          {product.stock > 0
            ? `${product.stock} in stock`
            : "Out of stock"}
        </span>
        <span className="rounded-full bg-white px-4 py-2 border">
          Category:{" "}
          {product.category?.name}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <span className="font-medium">
          Quantity
        </span>
        <div className="flex items-center border rounded-lg overflow-hidden bg-white">
          <button
            type="button"
            className="px-4 py-2"
            onClick={() =>
              setQuantity((value) =>
                Math.max(1, value - 1)
              )
            }
          >
            -
          </button>
          <span className="px-4 py-2 border-x">
            {quantity}
          </span>
          <button
            type="button"
            className="px-4 py-2"
            onClick={() =>
              setQuantity((value) =>
                Math.min(
                  product.stock,
                  value + 1
                )
              )
            }
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="button"
          onClick={() =>
            void handleAddToCart()
          }
          disabled={
            submitting ||
            product.stock <= 0
          }
          className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <ShoppingBag size={18} />
          {submitting
            ? "Adding..."
            : "Add To Cart"}
        </button>
        <button
          type="button"
          onClick={() =>
            void handleWishlist()
          }
          className="btn-outline flex items-center justify-center gap-2"
        >
          <Heart
            size={18}
            fill={
              wishlisted
                ? "currentColor"
                : "none"
            }
          />
          {wishlisted
            ? "Wishlisted"
            : "Wishlist"}
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;
