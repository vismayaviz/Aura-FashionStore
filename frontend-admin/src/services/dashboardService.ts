import api from "../api/axios";

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalSales: number;
}

export const dashboardService = {
  getStats: async () => {
    const response = await api.get<DashboardStats>("/admin/dashboard");
    return response.data;
  },
};
