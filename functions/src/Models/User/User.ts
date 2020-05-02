import { Order } from "../Order/Order";

export interface User {
  id: string;
  avatar?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  orders: Order[];
  score?: number;
}

export enum UserRole {
    Customer,
    Seller
}
  