// pages/api/orders/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { OrderItem } from "@/store/slice/types";

const orders: OrderItem[] = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    return res.status(200).json({ success: true, orders: orders });
  } else if (req.method === "POST") {
    const newOrder = { id: Date.now().toString(), ...req.body };
    orders.push(newOrder);
    return res.status(201).json({ success: true, data: newOrder });
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res
      .status(405)
      .json({ success: false, error: `Method ${req.method} Not Allowed` });
  }
}
