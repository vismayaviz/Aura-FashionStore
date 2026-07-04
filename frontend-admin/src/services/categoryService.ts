import api from "../api/axios";
import type { CategoryItem, CategoryFormValues } from "../types/category";

export const categoryService = {
  getAll: async () => {
    const response = await api.get<CategoryItem[]>("/categories");
    return response.data;
  },
  create: async (payload: CategoryFormValues) => {
    const response = await api.post<CategoryItem>("/categories", payload);
    return response.data;
  },
  delete: async (id: string) => {
    await api.delete(`/categories/${id}`);
  },
};
