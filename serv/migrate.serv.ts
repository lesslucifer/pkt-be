import * as mongodb from 'mongodb';

const MIGRATIONS = [initGameIndexes, initHandIndexes, initHandIndexes2, initHandIndexes3, initGameLogsIndexes, initGameLogsIndexes2];

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

async function dropAllIndexesOfKey(col: mongodb.Collection, key: string) {
    const idxs = await col.listIndexes().toArray()
    const idIdxs = idxs.filter(idx => !!idx.key[key]).map(idx => idx.name)
    for (const idx of idIdxs) {
        await col.dropIndex(idx)
    }
}

async function initGameIndexes(db: mongodb.Db) {
    await db.collection('game').createIndex({id: 'hashed'})
    await db.collection('game').createIndex({status: 1})
    await db.collection('game').createIndex({lastActive: -1})
    await db.collection('game').createIndex({lastSave: -1})
}

async function initHandIndexes(db: mongodb.Db) {
    await db.collection('hand').createIndex({id: 'hashed'})
    await db.collection('hand').createIndex({handId: 'hashed'})
}

async function initHandIndexes2(db: mongodb.Db) {
    await dropAllIndexesOfKey(db.collection('hand'), 'id')
    db.collection('hand').createIndex({id: -1})
}

async function initHandIndexes3(db: mongodb.Db) {
    await dropAllIndexesOfKey(db.collection('hand'), 'handId')
    await db.collection('hand').createIndex({gameId: 'hashed'})
}

async function initGameLogsIndexes(db: mongodb.Db) {
    await db.collection('game_logs').createIndex({id: 'hashed'})
    await db.collection('game_logs').createIndex({id: 1, 'logs.action': 1})
    await db.collection('game_logs').createIndex({id: 1, 'logs.time': 1})
}

async function initGameLogsIndexes2(db: mongodb.Db) {
    await db.collection('game_logs').createIndex({id: 1, _id: -1})
}
