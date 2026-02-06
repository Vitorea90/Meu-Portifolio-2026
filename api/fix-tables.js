import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
    try {
        // Upgrade projects table
        await sql`ALTER TABLE projects ALTER COLUMN id TYPE BIGINT;`;

        // Upgrade events table
        await sql`ALTER TABLE events ALTER COLUMN id TYPE BIGINT;`;
        await sql`ALTER TABLE events ALTER COLUMN year TYPE TEXT;`;
        try {
            await sql`ALTER TABLE events ADD COLUMN icon TEXT;`;
        } catch (e) {
            console.log("Icon column might already exist", e.message);
        }

        // Upgrade skills table (adding id if it's missing or serial)
        try {
            await sql`ALTER TABLE skills ALTER COLUMN id TYPE BIGINT;`;
        } catch (e) {
            console.log("Skills id might already be bigint or serial mismatch", e.message);
        }

        return response.status(200).json({ message: 'Tabelas atualizadas com sucesso para BIGINT!' });
    } catch (error) {
        console.error('Erro na migração:', error);
        return response.status(500).json({ error: error.message });
    }
}
