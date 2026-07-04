export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface OrderItem {
  product: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

export interface OrderItemWithId extends OrderItem {
  _id: string;
}

export interface OrderItemResponse {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItemWithId[];
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatusUpdateResponse = Pick<
  OrderItemResponse,
  "_id" | "status" | "updatedAt"
>;
