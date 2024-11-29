// src/types.ts

export interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface ShippingInfo {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  area: string;
  address: string;
}

export interface Errors {
  shipping: {
    fullName: boolean;
    phone: boolean;
    email: boolean;
    city: boolean;
    area: boolean;
    address: boolean;
  };
  payment: {
    cardNumber: boolean;
    expiryDate: boolean;
    cvv: boolean;
  };
}

// export interface SelectedItem {
//   id: string;
//   name: string;
//   image: string;
//   price: number;
//   color: string;
//   size: string;
//   quantity: number;
// }
