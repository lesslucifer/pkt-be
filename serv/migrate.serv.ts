import * as mongodb from 'mongodb';

const MIGRATIONS = [initGameIndexes];

export async function runMigration(db: mongodb.Db) {
    const dbConfig = await db.collection('config').findOne({ type: 'db' });
    const migrations: string[] = (dbConfig && dbConfig.migrations) || [];
    for (const mig of MIGRATIONS) {
        if (!migrations.includes(mig.name)) {
            await mig(db);
            await db.collection('config').updateOne({ type: 'db' }, { $push: { migrations: mig.name } }, { upsert: true });
        }
    }
}

async function initGameIndexes(db: mongodb.Db) {
    await db.collection('game').createIndex({id: 'hashed'})
    await db.collection('game').createIndex({status: 1})
    await db.collection('game').createIndex({lastActive: -1})
    await db.collection('game').createIndex({lastSave: -1})
}