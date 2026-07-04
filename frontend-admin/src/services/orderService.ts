import api from "../api/axios";
import type {
  OrderItemResponse,
  OrderStatus,
  OrderStatusUpdateResponse,
} from "../types/order";

export const orderService = {
  getAll: async () => {
    const response = await api.get<OrderItemResponse[]>("/orders");
    return response.data;
  },
  updateStatus: async (id: string, status: OrderStatus) => {
    const response = await api.put<OrderStatusUpdateResponse>(
      `/orders/${id}/status`,
      {
        status,
      }
    );
    return response.data;
  },
};
