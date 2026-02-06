import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  try {
    // Create projects table
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id BIGINT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        image TEXT,
        images TEXT[],
        tech_stack TEXT[],
        link TEXT,
        github TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create events table
    await sql`
      CREATE TABLE IF NOT EXISTS events (
        id BIGINT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        date TEXT,
        year TEXT,
        type TEXT,
        award TEXT,
        image TEXT,
        images TEXT[],
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create skills table
    await sql`
      CREATE TABLE IF NOT EXISTS skills (
        id BIGINT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT,
        icon TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    return response.status(200).json({ message: 'Tables created successfully' });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
