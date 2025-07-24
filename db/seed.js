require('dotenv').config();
const { Client } = require('pg');

const SQL = `
    CREATE TABLE IF NOT EXISTS sizes (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        size VARCHAR(15) NOT NULL UNIQUE
    );
    CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        title VARCHAR(30) NOT NULL,
        size_id INTEGER REFERENCES sizes(id) ON DELETE RESTRICT,
        quantity INTEGER NOT NULL
    );
    INSERT INTO sizes (size)
    VALUES
        ('All'),
        ('Small')
        ON CONFLICT (size) DO NOTHING;
`;

async function seed() {
  console.log('seeding...');
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  try {
    await client.query(SQL);
  } catch (err) {
    console.error(err);
  }
  await client.end();
  console.log('seeding completed.');
}

seed();
