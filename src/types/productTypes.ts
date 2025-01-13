export interface Review {
  rating: number; // 評分
  comment: string; // 評論文字
  date: string; // 評論日期
  reviewerName: string; // 評論者名稱
  reviewerEmail: string; // 評論者郵箱
}

export interface Product {
  id: number;
  title: string;
  images: string[];
  price: number;
  stock: number;
  rating: number;
  description: string;
  reviews: Review[]; // 新增評論屬性

  category?: string;
  colors?: string[];
  sizes?: string[];
  discountPrice?: number;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
  image?: string; // 新增圖片屬性
}

export interface ProductState {
  products: Product[];
  categories: Category[];
  topRatedProducts: Product[];
  filteredProducts: Product[];
  loading: boolean;
  error: string | null;
}
