import { useShop } from "./useShop";

export const useWishlist = () => {
  const {
    wishlist,
    wishlistLoading,
    refreshWishlist,
    addToWishlist,
    removeFromWishlist,
    isWishlisted,
  } = useShop();

  return {
    wishlist,
    loading: wishlistLoading,
    fetchWishlist: refreshWishlist,
    addToWishlist,
    removeFromWishlist,
    isWishlisted,
  };
};
