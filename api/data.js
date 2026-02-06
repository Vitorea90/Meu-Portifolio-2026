import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
    const { method } = request;
    const { type } = request.query;

    if (method === 'GET') {
        try {
            let result;
            if (type === 'projects') {
                result = await sql`SELECT * FROM projects ORDER BY id ASC;`;
            } else if (type === 'events') {
                result = await sql`SELECT * FROM events ORDER BY id ASC;`;
            } else if (type === 'skills') {
                result = await sql`SELECT * FROM skills ORDER BY id ASC;`;
            } else {
                return response.status(400).json({ error: 'Invalid type' });
            }

            // Map snake_case to camelCase for frontend compatibility
            const items = result.rows.map(row => {
                const item = { ...row };
                if (item.tech_stack) item.techStack = item.tech_stack;
                if (item.updated_at) item.updatedAt = item.updated_at;
                return item;
            });

            return response.status(200).json(items);
        } catch (error) {
            return response.status(500).json({ error: error.message });
        }
    }

    if (method === 'POST') {
        try {
            const { items } = request.body;

            if (type === 'projects') {
                await sql`DELETE FROM projects;`; // Standardizing on replacement for now as per local storage behavior
                for (const item of items) {
                    await sql`
            INSERT INTO projects (title, description, image, images, tech_stack, link, github)
            VALUES (${item.title}, ${item.description}, ${item.image}, ${item.images || []}, ${item.techStack || []}, ${item.link}, ${item.github});
          `;
                }
            } else if (type === 'events') {
                await sql`DELETE FROM events;`;
                for (const item of items) {
                    await sql`
            INSERT INTO events (title, description, date, year, type, award, image, images)
            VALUES (${item.title}, ${item.description}, ${item.date}, ${item.year}, ${item.type}, ${item.award}, ${item.image}, ${item.images || []});
          `;
                }
            } else if (type === 'skills') {
                await sql`DELETE FROM skills;`;
                for (const item of items) {
                    await sql`
            INSERT INTO skills (name, category, icon)
            VALUES (${item.name}, ${item.category}, ${item.icon});
          `;
                }
            }

            return response.status(200).json({ message: 'Data saved successfully' });
        } catch (error) {
            return response.status(500).json({ error: error.message });
        }
    }

    return response.status(405).json({ error: 'Method not allowed' });
}
