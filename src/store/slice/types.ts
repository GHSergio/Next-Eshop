import { Product } from "@/api";
// User
export interface userInfo {
  id: string;
  name: string;
  email: string;
}

export interface CartItem {
  id: string;
  title: string;
  image: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
}

export interface UserState {
  isLoggedIn: boolean;
  userInfo: userInfo | null;
  cart: CartItem[] | [];
}

//Product
export interface CartItem {
  id: string;
  image: string;
  title: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
}

export interface ProductState {
  products: Product[];
  categories: string[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  cart: CartItem[];
  showCart: boolean;
}
