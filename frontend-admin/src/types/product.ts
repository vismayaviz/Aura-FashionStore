import type { CategoryItem } from "./category";

export interface ProductItem {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: CategoryItem | string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormValues {
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
}
