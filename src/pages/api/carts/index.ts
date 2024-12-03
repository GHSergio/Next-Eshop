// pages/api/cart/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { CartItem } from "@/types";

const cartItems: CartItem[] = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    return res.status(200).json(cartItems);
  } else if (req.method === "POST") {
    const item = req.body;
    cartItems.push(item);
    return res.status(201).json({ success: true, data: item });
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res
      .status(405)
      .json({ success: false, error: `Method ${req.method} Not Allowed` });
  }
}
