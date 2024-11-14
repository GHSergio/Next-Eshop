// pages/api/orders/[orderId].ts
import { NextApiRequest, NextApiResponse } from "next";
import { OrderItem } from "@/store/slice/types";

const orders: OrderItem[] = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { orderId } = req.query;
  if (req.method === "GET") {
    const order = orders.find((order) => order.id === orderId);
    if (order) {
      return res.status(200).json({ success: true, data: order });
    } else {
      return res.status(404).json({ success: false, error: "找不到該訂單" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res
      .status(405)
      .json({ success: false, error: `Method ${req.method} Not Allowed` });
  }
}
