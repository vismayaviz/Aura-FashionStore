import { createContext } from "react";
import type { Cart } from "../types/cart";
import type { Wishlist } from "../types/wishlist";

export interface ShopContextType {
  cart: Cart | null;
  wishlist: Wishlist | null;
  cartLoading: boolean;
  wishlistLoading: boolean;
  refreshCart: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateCartQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
}

export const ShopContext =
  createContext<ShopContextType>(
    {} as ShopContextType
  );
