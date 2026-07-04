import type { Product } from "./product";

export interface Wishlist {
  _id: string;
  user: string;

  products: Product[];
}