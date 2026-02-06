import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
    const { method } = request;
    const { type } = request.query;

    if (method === 'GET') {
        const { type, id } = request.query;
        let result;
        try {
            if (id) {
                // Fetch single item with all data
                if (type === 'projects') {
                    result = await sql`SELECT * FROM projects WHERE id = ${id};`;
                } else if (type === 'events') {
                    result = await sql`SELECT * FROM events WHERE id = ${id};`;
                } else if (type === 'skills') {
                    result = await sql`SELECT * FROM skills WHERE id = ${id};`;
                }
                // Helper to map snake_case to camelCase for single item
                const mappedItem = result.rows[0] ? Object.keys(result.rows[0]).reduce((acc, key) => {
                    const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
                    acc[camelKey] = result.rows[0][key];
                    return acc;
                }, {}) : null;
                return response.status(200).json(mappedItem);
            }

            // Fetch list - Exclude large 'images' array for projects and events
            if (type === 'projects') {
                result = await sql`SELECT id, title, description, image, tech_stack, link, github FROM projects ORDER BY id ASC;`;
            } else if (type === 'events') {
                result = await sql`SELECT id, title, description, date, year, type, award, icon, image FROM events ORDER BY id ASC;`;
            } else if (type === 'skills') {
                result = await sql`SELECT * FROM skills ORDER BY id ASC;`;
            } else {
                return response.status(400).json({ error: 'Invalid type' });
            }

            // Helper to map snake_case to camelCase
            const mappedData = result.rows.map(row => {
                const mapped = {};
                for (const key in row) {
                    const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
                    mapped[camelKey] = row[key];
                }
                return mapped;
            });

            return response.status(200).json(mappedData);
        } catch (error) {
            console.error('API Error:', error);
            // On error, return empty array to prevent frontend crash
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
                        INSERT INTO events (id, title, description, date, year, type, award, icon, image, images)
                        VALUES (${item.id}, ${item.title}, ${item.description}, ${item.date}, ${year}, ${item.type}, ${item.award}, ${item.icon}, ${item.image}, ${images})
                        ON CONFLICT (id) DO UPDATE SET
                            title = EXCLUDED.title,
                            description = EXCLUDED.description,
                            date = EXCLUDED.date,
                            year = EXCLUDED.year,
                            type = EXCLUDED.type,
                            award = EXCLUDED.award,
                            icon = EXCLUDED.icon,
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
                            INSERT INTO events (id, title, description, date, year, type, award, icon, image, images)
                            VALUES (${item.id}, ${item.title}, ${item.description}, ${item.date}, ${year}, ${item.type}, ${item.award}, ${item.icon}, ${item.image}, ${images});
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
