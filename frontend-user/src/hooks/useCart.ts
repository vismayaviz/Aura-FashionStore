import { useShop } from "./useShop";

export const useCart = () => {
  const {
    cart,
    cartLoading,
    refreshCart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
  } = useShop();

  return {
    cart,
    loading: cartLoading,
    fetchCart: refreshCart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
  };
};
