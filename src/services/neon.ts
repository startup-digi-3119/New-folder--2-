import { neon as neonConfig } from '@neondatabase/serverless';

const connectionString = import.meta.env.VITE_NEON_DATABASE_URL;

if (!connectionString) {
    console.warn('Neon database URL missing. Database operations will fail.');
}

// Create the sql client using the HTTP driver
const sql = connectionString ? neonConfig(connectionString) : null;

// Helper function to execute queries using the HTTP driver
export const query = async (text: string, params: any[] = []) => {
    if (!sql) {
        throw new Error('Neon database client not initialized. Check your environment variables.');
    }

    try {
        // The serverless driver takes a query string and returns rows directly if using the neon function
        // We need to handle parameters correctly. 
        // Note: The `neon` function from @neondatabase/serverless handles param injection via template literals
        // But since we want to support the (text, params) signature, we use the tag-less version or handle string manipulation

        // For standard (text, params) support, we can use the raw query method if we wrap it
        // However, the simplest way with the HTTP driver is to use the sql instance

        // Let's implement a simple parameter replacement for the HTTP driver if it doesn't support (text, params) directly
        let processedText = text;
        const result = await (sql as any)(processedText, params);

        // Return a response shape compatible with what the app expects (pg Result shape)
        return {
            rows: result,
            command: 'SELECT', // mock
            rowCount: result.length,
            oid: 0,
            fields: []
        };
    } catch (error: any) {
        console.error('Database query error:', error);
        throw error;
    }
};

// Export a Supabase-like interface for easier migration
export const neon = {
    query,
    from: (table: string) => ({
        select: async (columns: string = '*') => {
            try {
                const rows = await query(`SELECT ${columns} FROM ${table}`);
                return { data: rows.rows, error: null };
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
