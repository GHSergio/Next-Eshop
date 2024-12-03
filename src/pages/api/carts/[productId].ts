// pages/api/cart/[productId].ts
import { NextApiRequest, NextApiResponse } from "next";
import { CartItem } from "@/types";

let cartItems: CartItem[] = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { productId } = req.query;
  if (req.method === "DELETE") {
    cartItems = cartItems.filter((item) => item.id !== productId);
    return res.status(200).json({ success: true, message: "刪除成功" });
  } else {
    res.setHeader("Allow", ["DELETE"]);
    return res
      .status(405)
      .json({ success: false, error: `Method ${req.method} Not Allowed` });
  }
}
