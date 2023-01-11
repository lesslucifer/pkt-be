import _ from 'lodash';
import * as mongodb from 'mongodb';
import ENV, { ENV_DB_CONFIG } from './env';

// ************ CONFIGS ************
export class AppConnections {
    private mongo: mongodb.Db;

    constructor() {

    }

    get MONGO() { return this.mongo }

    async configureConnections(dbConfig: ENV_DB_CONFIG) {
        const mongoConn = new mongodb.MongoClient(dbConfig.MONGO_CONNECTION, {
            useUnifiedTopology: true,
            ...dbConfig.MONGO_OPTIONS
        });
        await mongoConn.connect()
        this.mongo = mongoConn.db(dbConfig.MONGO_DB)
    }
}

const CONN = new AppConnections();
export default CONN;
