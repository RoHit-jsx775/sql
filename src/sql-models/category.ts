import pool from "./mysql-client";
export const SqlCategoryModel = {
  async getAll() {
    const [result] = await pool.query("SELECT * FROM categories");
    return result;
  },
  async getById(id: number) {
    const [result] = await pool.query("SELECT * FROM categories WHERE id = ?", [
      id,
    ]);
    return Array.isArray(result) && result.length ? result[0] : undefined;
  },

  async update(
    id: number,
    p0: { name?: string;}
  ) {
    const fields = [];
    const values = [];
    if (p0.name !== undefined) {
      fields.push("name = ?");
      values.push(p0.name);
    }
    
    if (!fields.length) return undefined;
    await pool.query(`UPDATE categories SET ${fields.join(", ")} WHERE id = ?`, [
      ...values,
      id,
    ]);
    return this.getById(id);
  },

  async DeleteById (id: number) {
    const [rows] = await pool.query<any[]>( 
      "SELECT * FROM categories WHERE id = ?",
      [id]
    );
    if (rows.length === 0) {
      throw new Error(`Category with id ${id} not found`);
    }
    await pool.query("DELETE FROM categories WHERE id = ?", [id]);
    console.log(`Category with id ${id} deleted successfully`);
    return;
  },
  
   async createCategory(p0: {
  name:string;
 
}){
  const { name } = p0;
  const [result]: any = await pool.query(
    "INSERT INTO categories (name) VALUES (?)",
    [name]
  );
  const newcategoryId = result.insertId;
  const [newCategory] = await pool.query<any[]>(
    "SELECT * FROM categories WHERE id = ?",[newcategoryId]
  );
},
};