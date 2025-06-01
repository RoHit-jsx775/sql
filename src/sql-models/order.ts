import pool from "./mysql-client";
import { SqlProductModel } from "./product-sql-model";
import { SqlUserModel } from "./usermodel";

export const SqlOrderModel = {

async create(order: { userId: number; productIds: number[] }) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      let totalAmount = 0;

      for (const productId of order.productIds) {
        const product = await SqlProductModel.getById(productId) as { price: number } | null;

        if (!product) {
          throw new Error("product not found");
        }

        const amount = product.price;
        totalAmount += amount;
      }

      const [result]: any = await conn.query(
        "INSERT INTO orders (userId, total_amount) VALUES (?, ?)",
        [order.userId, totalAmount]
      );
      const orderId = result.insertId;
      for (const pid of order.productIds) {
        await conn.query(
          "INSERT INTO order_products (orderId, productId) VALUES (?, ?)",
          [orderId, pid]
        );
      }
      await conn.commit();
      return {
        id: orderId,
        userId: order.userId,
        productIds: order.productIds,
      };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }
}