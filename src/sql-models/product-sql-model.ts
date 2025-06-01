import pool from "./mysql-client";
export const SqlProductModel = {
  async getAll() {
    const [rows] = await pool.query("SELECT * FROM products");
    return rows;
  },

  async  getById(id: number) {
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);
  return Array.isArray(rows) && rows.length ? rows[0] : undefined;
  },


  // async update(id: number, input: { name: string; price: number; categoryId: string }) {
  //   const [row]: any = await pool.query(
  //     "UPDATE products SET name = ?, price = ?, categoryId = ? WHERE id = ?",
  //     [input.name, input.price, input.categoryId, id]
  //   );
  // //   return row && row.affectedRows > 0 ? { id, ...input } : undefined;
  // // }
  //  async updated(
  //   id: number,
  //   product: Partial<{ name: string; price: number; categoryId: number }>
  // ) {
  //   const fields = [];
  //   const values = [];
  //   if (product.name !== undefined) {
  //     fields.push("name = ?");
  //     values.push(product.name);
  //   }
  //   if (product.price !== undefined) {
  //     fields.push("price = ?");
  //     values.push(product.price);
  //   }
  //   if (product.categoryId !== undefined) {
  //     fields.push("categoryId = ?");
  //     values.push(product.categoryId);
  //   }
  //   if (!fields.length) return undefined;
  //   await pool.query(`UPDATE products SET ${fields.join(", ")} WHERE id = ?`, [
  //     ...values,
  //     id,
  //   ]);
  //   return this.getById(id);
  // },
    async Update(
    id: number,
    p0: { name?:string; price?:number;  categoryId?: number; }
  ) {
    try {
      console.log("Checking if product exists with id:", id);
      const [rows] = await pool.query<any[]>(
        "SELECT * FROM products WHERE id = ?",
        [id]
      );

      if (rows.length === 0) {
        throw new Error(`Product with id ${id} not found`);
      }

      const updateProduct = {
        ...rows[0],
        name: p0.name,
        price: p0.price,
       categoryId: p0.categoryId,
      };

      console.log("Updating product with data:", updateProduct);

      await pool.query(
        "UPDATE products SET name=?, price=?, categoryId=? WHERE id = ?",
        [p0.name, p0.price, p0.categoryId, id]
      );

      console.log(`Product with id ${id} updated successfully`);

      return updateProduct;
    } catch (error) {
      console.error("SQL error:", error);
      throw error;
    }
  },
    async DeleteById(id: number) {
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );
    if (rows.length === 0) {
      throw new Error(`Product with id ${id} not found`);
    }

    await pool.query("DELETE FROM products WHERE id = ?", [id]);

    console.log(`Product with id ${id} deleted successfully`);
    return;
  },
    async createProductDetails(p0: {
    name: string;
    price: number;
    categoryId: number;
   
  }) {
    const { name, price,categoryId } = p0;
    const [result] = await pool.query<any>(
      "INSERT INTO products (name, price,categoryId) VALUES (?, ?, ?)",
      [name, price, categoryId]
    );
    const newProductId = result.insertId;
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM products WHERE id = ?",
      [newProductId]
    );
  },
};
