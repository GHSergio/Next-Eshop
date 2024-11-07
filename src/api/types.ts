// 專門定義interface
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  colors?: string[];
  sizes?: string[];
  rating: {
    rate: number;
    count: number;
  };
}
