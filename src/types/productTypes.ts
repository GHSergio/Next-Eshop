export interface Product {
  id: number;
  title: string;
  image: string;
  price: number;
  description: string;
  category?: string;
  colors?: string[];
  sizes?: string[];
  rating?: {
    rate: number;
    count: number;
  };
  discountPrice?: number;
}

export interface ProductState {
  products: Product[];
  categories: string[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
}
