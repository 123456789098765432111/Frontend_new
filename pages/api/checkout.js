import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  const { address, phone, email, cartProducts } = req.body;

  await mongooseConnect();

  const productIds = cartProducts;
  const uniqueIds = [...new Set(productIds)];
  const productsInfo = await Product.find({ _id: { $in: uniqueIds } });

  let line_items = [];

  for (const productId of uniqueIds) {
    const productInfo = productsInfo.find(p => p._id.toString() === productId);

    const quantity = productIds.filter(id => id === productId).length;

    if (quantity > 0 && productInfo) {
      line_items.push({
        quantity,
        price_data: {
          currency: 'KES',
          product_data: { name: productInfo.title },
          unit_amount: productInfo.price * 100, 
        },
      });
    }
  }

  await Order.create({
    line_items, 
    address, 
    email, 
    phone, 
    paid: false,
    delivered:false,
    Void:false
  });

  res.status(200).json({
    message: 'Order created successfully',
  });
}
