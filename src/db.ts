// db.ts
import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;

async function connectDatabase() {
    if (!client) {
        client = new MongoClient(process.env.MONGODB_URI as string);

        await client.connect();
        return client.db();
    }
}

async function getDatabase() {
    const db = await connectDatabase();

    return db
}

export { connectDatabase, getDatabase };
