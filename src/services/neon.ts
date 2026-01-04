import { Pool } from '@neondatabase/serverless';

const connectionString = import.meta.env.VITE_NEON_DATABASE_URL;

const isPlaceholder = connectionString?.includes('user:password@hostname');

if (!connectionString || isPlaceholder) {
    console.error('CRITICAL: Neon Database URL is missing or set to the placeholder value. Please update VITE_NEON_DATABASE_URL in your environment variables.');
}

// Create the pool using the serverless driver (WebSocket-based, pg-compatible)
const pool = new Pool({
    connectionString: isPlaceholder ? 'postgresql://localhost:5432/placeholder' : connectionString,
    // Add some defaults for reliability
    connectionTimeoutMillis: 10000,
});

// Helper function to execute queries
export const query = async (text: string, params: any[] = []) => {
    if (!connectionString || isPlaceholder) {
        throw new Error('Database connection failed: The connection URL is invalid or is the placeholder value from .env.example. Please update your Vercel/Environment Variables.');
    }

    const client = await pool.connect();
    try {
        const result = await client.query(text, params);
        return result;
    } catch (error: any) {
        console.error('Database query error:', error);
        throw error;
    } finally {
        client.release();
    }
};

// Export a Supabase-like interface for easier migration
export const neon = {
    query,
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
            const sqlStr = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
            try {
                const result = await query(sqlStr, Object.values(values));
                return { data: result.rows[0], error: null };
            } catch (error: any) {
                return { data: null, error };
            }
        },
        update: async (values: any) => ({
            eq: async (column: string, value: any) => {
                const keys = Object.keys(values);
                const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
                const sqlStr = `UPDATE ${table} SET ${setClause} WHERE ${column} = $${keys.length + 1} RETURNING *`;
                try {
                    const result = await query(sqlStr, [...Object.values(values), value]);
                    return { data: result.rows, error: null };
                } catch (error: any) {
                    return { data: null, error };
                }
            }
        }),
        delete: () => ({
            eq: async (column: string, value: any) => {
                const sqlStr = `DELETE FROM ${table} WHERE ${column} = $1 RETURNING *`;
                try {
                    const result = await query(sqlStr, [value]);
                    return { data: result.rows, error: null };
                } catch (error: any) {
                    return { data: null, error };
                }
            }
        })
    })
};

export default neon;
