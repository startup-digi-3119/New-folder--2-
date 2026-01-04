import { Pool } from 'pg';

const connectionString = import.meta.env.VITE_NEON_DATABASE_URL;

if (!connectionString) {
    console.warn('Neon database URL missing. Database operations will fail.');
}

// Create a connection pool
const pool = new Pool({
    connectionString: connectionString || 'postgresql://localhost:5432/placeholder',
    ssl: connectionString ? { rejectUnauthorized: false } : undefined,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});

// Helper function to execute queries
export const query = async (text: string, params?: any[]) => {
    const client = await pool.connect();
    try {
        const result = await client.query(text, params);
        return result;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    } finally {
        client.release();
    }
};

// Export the pool for advanced usage
export const db = pool;

// Export a Supabase-like interface for easier migration
export const neon = {
    from: (table: string) => ({
        select: async (columns: string = '*') => {
            try {
                const result = await query(`SELECT ${columns} FROM ${table}`);
                return { data: result.rows, error: null };
            } catch (error: any) {
                return { data: null, error };
            }
        },
        insert: async (values: any) => {
            const keys = Object.keys(values);
            const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
            const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
            try {
                const result = await query(sql, Object.values(values));
                return { data: result.rows[0], error: null };
            } catch (error: any) {
                return { data: null, error };
            }
        },
        update: async (values: any) => ({
            eq: async (column: string, value: any) => {
                const keys = Object.keys(values);
                const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
                const sql = `UPDATE ${table} SET ${setClause} WHERE ${column} = $${keys.length + 1} RETURNING *`;
                try {
                    const result = await query(sql, [...Object.values(values), value]);
                    return { data: result.rows, error: null };
                } catch (error: any) {
                    return { data: null, error };
                }
            }
        }),
        delete: () => ({
            eq: async (column: string, value: any) => {
                const sql = `DELETE FROM ${table} WHERE ${column} = $1 RETURNING *`;
                try {
                    const result = await query(sql, [value]);
                    return { data: result.rows, error: null };
                } catch (error: any) {
                    return { data: null, error };
                }
            }
        })
    })
};

export default neon;
