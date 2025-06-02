import pool from "./mysql-client";
import { SqlProductModel } from "./product-sql-model";


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
        //using constructor to convert string to number

        const amount =Number( product.price);

        totalAmount += amount;
        console.log("result",totalAmount,amount,product)
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
  },
  async getorderById(id: number) {
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM orders WHERE id = ?",
      [id]
    );
    console.log("rows", rows);

    if (rows.length === 0) {
      throw new Error(`Order with id ${id} not found`);
    }
    return rows[0];
  },
  async getAllOrders() {
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM orders"
    );
    if (rows.length === 0) {
      throw new Error("No orders found");
    }
    return rows;
  },
  async updateOrderbyId(
    id: number,
    p0: { userId?: number; productIds?: number[] }
  ) {
    const { userId, productIds } = p0;

    const [rows] = await pool.query<any[]>(
      "SELECT * FROM orders WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      throw new Error(`Order with id ${id} not found`);
    }

    const order = rows[0];

    if (userId !== undefined) {
      order.userId = userId;
    }

    if (productIds !== undefined) {
      order.productIds = productIds;
    }

    await pool.query(
      "UPDATE orders SET userId = ?, total_amount = ? WHERE id = ?",
      [order.userId, order.total_amount, id]
    );

    return order;
  },
  async deleteOrderById(id: number)
  {
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM orders WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      throw new Error(`Order with id ${id} not found`);
    }

    await pool.query("DELETE FROM orders WHERE id = ?", [id]);
    console.log(`Order with id ${id} deleted successfully`);
  }
}