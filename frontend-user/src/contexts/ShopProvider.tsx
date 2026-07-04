import { useCallback, useEffect, useState } from "react";
import api from "../api/axios";
import { ShopContext } from "./ShopContext";
import type { Cart } from "../types/cart";
import type { Wishlist } from "../types/wishlist";

export const ShopProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cart, setCart] =
    useState<Cart | null>(null);
  const [wishlist, setWishlist] =
    useState<Wishlist | null>(null);
  const [cartLoading, setCartLoading] =
    useState(true);
  const [wishlistLoading, setWishlistLoading] =
    useState(true);

  const refreshCart = useCallback(async () => {
    setCartLoading(true);

    try {
      const res = await api.get<Cart | null>(
        "/cart"
      );
      setCart(res.data);
    } finally {
      setCartLoading(false);
    }
  }, []);

  const refreshWishlist = useCallback(async () => {
    setWishlistLoading(true);

    try {
      const res = await api.get<Wishlist | null>(
        "/wishlist"
      );
      setWishlist(res.data);
    } finally {
      setWishlistLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadShop = async () => {
      try {
        const [cartRes, wishlistRes] =
          await Promise.all([
            api.get<Cart | null>("/cart"),
            api.get<Wishlist | null>(
              "/wishlist"
            ),
          ]);

        setCart(cartRes.data);
        setWishlist(wishlistRes.data);
      } finally {
        setCartLoading(false);
        setWishlistLoading(false);
      }
    };

    void loadShop();
  }, []);

  const addToCart = async (
    productId: string,
    quantity = 1
  ) => {
    await api.post<Cart>(
      "/cart/add",
      {
        productId,
        quantity,
      }
    );

    await refreshCart();
  };

  const updateCartQuantity = async (
    productId: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    await api.put<Cart>(
      "/cart/update",
      {
        productId,
        quantity,
      }
    );

    await refreshCart();
  };

  const removeFromCart = async (
    productId: string
  ) => {
    await api.delete<Cart>(
      `/cart/remove/${productId}`
    );

    await refreshCart();
  };

  const addToWishlist = async (
    productId: string
  ) => {
    await api.post<Wishlist>(
      "/wishlist/add",
      {
        productId,
      }
    );

    await refreshWishlist();
  };

  const removeFromWishlist = async (
    productId: string
  ) => {
    await api.delete<Wishlist>(
      `/wishlist/remove/${productId}`
    );

    await refreshWishlist();
  };

  const isWishlisted = useCallback(
    (productId: string) =>
      Boolean(
        wishlist?.products.some(
          (product) =>
            product._id === productId
        )
      ),
    [wishlist]
  );

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        cartLoading,
        wishlistLoading,
        refreshCart,
        refreshWishlist,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        addToWishlist,
        removeFromWishlist,
        isWishlisted,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
