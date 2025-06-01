import pool from "./mysql-client"
export const SqlUserModel = {
  async getAll() {
    const [rows] = await pool.query("SELECT * FROM users");
    return rows;
  },

  async getById(id: number){
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    return Array.isArray(rows) && rows.length ? rows[0] : undefined;
  },
    async update(
        id: number,
        p0: { name?: string; email?: string; }
    ) {
        const fields = [];
        const values = [];
        if (p0.name !== undefined) {
        fields.push("name = ?");
        values.push(p0.name);
        }
        if (p0.email !== undefined) {
        fields.push("email = ?");
        values.push(p0.email);
        }
        if (!fields.length) return undefined;
        await pool.query(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`, [
        ...values,
        id,
        ]);
        return this.getById(id);
    },
    async deleteById(id: number) {
        const [rows] = await pool.query<any[]>(
            "SELECT * FROM users WHERE id = ?",
            [id]
        );
        if (rows.length === 0) {
            throw new Error(`User with id ${id} not found`);
        }
        await pool.query("DELETE FROM users WHERE id = ?", [id]);
        console.log(`User with id ${id} deleted successfully`);
        return;
    },
    async createUserDetails(p0: {
        name: string;
        email: string;
    }) {
        const { name, email } = p0;
        const [result]: any = await pool.query(
            "INSERT INTO users (name, email) VALUES (?, ?)",
            [name, email]
        );
        const newUserId = result.insertId;
        const [newUser] = await pool.query<any[]>(
            "SELECT * FROM users WHERE id = ?", [newUserId]
        );
        return newUser[0];
    }
}