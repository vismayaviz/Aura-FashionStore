import api from "../api/axios";
import type { ProductItem, ProductFormValues } from "../types/product";

export const productService = {
  getAll: async () => {
    const response = await api.get<ProductItem[]>("/products");
    return response.data;
  },
  create: async (payload: ProductFormValues | FormData) => {
  const response = await api.post<ProductItem>(
    "/products",
    payload,
    payload instanceof FormData
      ? {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      : undefined
  );

  return response.data;
},
 update: async (
  id: string,
  payload: ProductFormValues | FormData
) => {
  const response = await api.put<ProductItem>(
    `/products/${id}`,
    payload,
    payload instanceof FormData
      ? {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      : undefined
  );

  return response.data;
},
  delete: async (id: string) => {
    await api.delete(`/products/${id}`);
  },
};