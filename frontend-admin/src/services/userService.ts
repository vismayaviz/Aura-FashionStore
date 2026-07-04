import api from "../api/axios";
import type { UserItem } from "../types/user";

export const userService = {
  getAll: async () => {
    const response = await api.get<UserItem[]>("/users");
    return response.data;
  },
};
