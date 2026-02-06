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
            console.error('API Error:', error);
            return response.status(200).json([]);
        }
    }

    if (method === 'POST') {
        try {
            const { items, item, action, id } = request.body;

            // 1. DELETE Action
            if (action === 'delete' && id) {
                if (type === 'projects') await sql`DELETE FROM projects WHERE id = ${id};`;
                else if (type === 'events') await sql`DELETE FROM events WHERE id = ${id};`;
                else if (type === 'skills') await sql`DELETE FROM skills WHERE id = ${id};`;
                return response.status(200).json({ message: 'Item deleted successfully' });
            }

            // 2. UPSERT Action (Single Item)
            if (action === 'upsert' && item) {
                if (type === 'projects') {
                    const techStack = Array.isArray(item.techStack) ? item.techStack : [];
                    const images = Array.isArray(item.images) ? item.images : [];
                    await sql`
                        INSERT INTO projects (id, title, description, image, images, tech_stack, link, github)
                        VALUES (${item.id}, ${item.title}, ${item.description}, ${item.image}, ${images}, ${techStack}, ${item.link}, ${item.github})
                        ON CONFLICT (id) DO UPDATE SET
                            title = EXCLUDED.title,
                            description = EXCLUDED.description,
                            image = EXCLUDED.image,
                            images = EXCLUDED.images,
                            tech_stack = EXCLUDED.tech_stack,
                            link = EXCLUDED.link,
                            github = EXCLUDED.github,
                            updated_at = CURRENT_TIMESTAMP;
                    `;
                } else if (type === 'events') {
                    const images = Array.isArray(item.images) ? item.images : [];
                    const year = item.year || (item.date ? new Date(item.date).getFullYear().toString() : '');
                    await sql`
                        INSERT INTO events (id, title, description, date, year, type, award, image, images)
                        VALUES (${item.id}, ${item.title}, ${item.description}, ${item.date}, ${year}, ${item.type}, ${item.award}, ${item.image}, ${images})
                        ON CONFLICT (id) DO UPDATE SET
                            title = EXCLUDED.title,
                            description = EXCLUDED.description,
                            date = EXCLUDED.date,
                            year = EXCLUDED.year,
                            type = EXCLUDED.type,
                            award = EXCLUDED.award,
                            image = EXCLUDED.image,
                            images = EXCLUDED.images,
                            updated_at = CURRENT_TIMESTAMP;
                    `;
                } else if (type === 'skills') {
                    await sql`
                        INSERT INTO skills (id, name, category, icon)
                        VALUES (${item.id}, ${item.name}, ${item.category}, ${item.icon})
                        ON CONFLICT (id) DO UPDATE SET
                            name = EXCLUDED.name,
                            category = EXCLUDED.category,
                            icon = EXCLUDED.icon,
                            updated_at = CURRENT_TIMESTAMP;
                    `;
                }
                return response.status(200).json({ message: 'Item saved successfully' });
            }

            // 3. BULK Action (Original support - use with caution for size)
            if (items && Array.isArray(items)) {
                if (type === 'projects') {
                    await sql`DELETE FROM projects;`;
                    for (const item of items) {
                        const techStack = Array.isArray(item.techStack) ? item.techStack : [];
                        const images = Array.isArray(item.images) ? item.images : [];
                        await sql`
                            INSERT INTO projects (id, title, description, image, images, tech_stack, link, github)
                            VALUES (${item.id}, ${item.title}, ${item.description}, ${item.image}, ${images}, ${techStack}, ${item.link}, ${item.github});
                        `;
                    }
                } else if (type === 'events') {
                    await sql`DELETE FROM events;`;
                    for (const item of items) {
                        const images = Array.isArray(item.images) ? item.images : [];
                        const year = item.year || (item.date ? new Date(item.date).getFullYear().toString() : '');
                        await sql`
                            INSERT INTO events (id, title, description, date, year, type, award, image, images)
                            VALUES (${item.id}, ${item.title}, ${item.description}, ${item.date}, ${year}, ${item.type}, ${item.award}, ${item.image}, ${images});
                        `;
                    }
                } else if (type === 'skills') {
                    await sql`DELETE FROM skills;`;
                    for (const item of items) {
                        await sql`
                            INSERT INTO skills (id, name, category, icon)
                            VALUES (${item.id || Date.now()}, ${item.name}, ${item.category}, ${item.icon});
                        `;
                    }
                }
                return response.status(200).json({ message: 'Data saved successfully' });
            }

            return response.status(400).json({ error: 'Missing action or items' });
        } catch (error) {
            console.error('Error saving data:', error);
            return response.status(500).json({ error: error.message });
        }
    }

    return response.status(405).json({ error: 'Method not allowed' });
}
