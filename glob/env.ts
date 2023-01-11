import _ from 'lodash';
import newAjv2 from '../utils/ajv2';
import hera from '../utils/hera';
import dotenv = require('dotenv')

dotenv.config({path: 'process.env'})

const ajv = newAjv2();

export interface ENV_DB_CONFIG {
    MONGO_CONNECTION: string;
    MONGO_DB: string;
    MONGO_OPTIONS: any;
}

const ajvEnvDbConfig = {
    '+@MONGO_CONNECTION': 'string',
    '+@MONGO_DB': 'string',
    'MONGO_OPTIONS': {}
}

export interface ENV_CONFIG extends ENV_DB_CONFIG {
    NAME: string;
    HTTP_PORT: number;
    LOG_LEVEL: string;
}

const ajvEnvConfig = ajv({
    '+@NAME': 'string',
    '@HTTP_PORT': 'number',
    '@LOG_LEVEL': 'string',
    ...ajvEnvDbConfig
})

const ENV_DEFAULT: Partial<ENV_CONFIG> = {
    NAME: 'PKT',
    HTTP_PORT: 3492,
    LOG_LEVEL: 'debug',
    MONGO_OPTIONS: {},
}

const envCustomParser = {
    MONGO_OPTIONS: hera.toJSON,
    HTTP_PORT: hera.parseInt
}

function loadConfig(): ENV_CONFIG {
    const config: any = _.cloneDeep(ENV_DEFAULT);
    for (const key in process.env) {
        let val = process.env[key]
        if (envCustomParser[key]) {
            val = envCustomParser[key](val)
        }
        _.set(config, key, val);
    }

    if (!ajvEnvConfig(config)) throw new Error(`Invalid env config; ${JSON.stringify(ajvEnvConfig.errors, null, 2)}`)
    return config;
}

export const ENV: ENV_CONFIG = loadConfig();
export default ENV;
