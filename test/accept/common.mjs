import {configDto, dbConnect as dbConnectFw, RDBMS} from '@teqfw/test';
import {join} from 'path';
import 'dotenv/config';

/**
 * @param {TeqFw_Di_Api_Container} container
 * @return {Promise<void>}
 */
export async function dbConnect(container) {
    /** @type {TeqFw_Db_Back_RDb_Connect} */
    const conn = await container.get('TeqFw_Db_Back_RDb_IConnect$');
    // Set up DB connection for the Object Container
    await dbConnectFw(RDBMS.SQLITE_BETTER, conn);
}

/**
 * @param {TeqFw_Di_Api_Container} container
 * @return {Promise<void>}
 */
export async function dbDisconnect(container) {
    try {
        /** @type {TeqFw_Db_Back_RDb_Connect} */
        const conn = await container.get('TeqFw_Db_Back_RDb_IConnect$');
        await conn.disconnect();
    } catch (e) {
        debugger
    }
}

/**
 * @param {TeqFw_Di_Api_Container} container
 * @return {Promise<{user: {id: undefined}}>}
 */
export async function dbCreateFkEntities(container) {
    const user = {id: undefined};

    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = await container.get('TeqFw_Core_Shared_Api_Logger$$');
    /** @type {TeqFw_Db_Back_RDb_Connect} */
    const conn = await container.get('TeqFw_Db_Back_RDb_IConnect$');
    /** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
    const crud = await container.get('TeqFw_Db_Back_Api_RDb_CrudEngine$');

    // Create an app user
    await dbConnect(container);
    const trx = await conn.startTransaction();
    try {
        // TODO: this test should be independent of a project
        const rdbBase = {
            getAttributes: () => ({
                DATE_BIRTH: 'date_birth',
                DATE_CREATED: 'date_created',
                GENDER: 'gender',
                HEIGHT: 'height',
                ID: 'id',
                NAME: 'name',
                TOKEN: 'token',
                WEIGHT_CURRENT: 'weight_current'
            }),
            getEntityName: () => '/user',
            getPrimaryKey: () => ['id'],
        };
        const {id} = await crud.create(trx, rdbBase, {
            date_birth: new Date(),
            date_created: new Date(),
            gender: 'MALE',
            height: 180,
            id: undefined,
            name: 'user',
            token: 'token',
            weight_current: 75,
        });
        await trx.commit();
        user.id = id;
    } catch (e) {
        await trx.rollback();
        logger.exception(e);
    }
    await dbDisconnect(container);
    return {user};
}

/**
 * @param {TeqFw_Di_Api_Container} container
 * @return {Promise<void>}
 */
export async function dbReset(container) {
    try {
        /** @type {TeqFw_Core_Back_Config} */
        const config = await container.get('TeqFw_Core_Back_Config$');
        // Initialize database structure using test DEM
        /** @type {{action: TeqFw_Db_Back_Cli_Init.action}} */
        const {action} = await container.get('TeqFw_Db_Back_Cli_Init$');
        const testDems = {
            test: join(config.getPathToRoot(), 'test', 'data'),
        };
        await dbConnect(container);
        await action({testDems});
        await dbDisconnect(container);
    } catch (e) {
        debugger
    }
}

/**
 * @param {TeqFw_Di_Api_Container} container
 * @return {Promise<void>}
 */
export async function initConfig(container) {
    // Initialize environment configuration
    /** @type {TeqFw_Core_Back_Config} */
    const config = await container.get('TeqFw_Core_Back_Config$');
    config.init(configDto.pathToRoot, '0.0.0');

    // Set up console transport for the logger
    /** @type {TeqFw_Core_Shared_Logger_Base} */
    const base = await container.get('TeqFw_Core_Shared_Logger_Base$');
    /** @type {TeqFw_Core_Shared_Api_Logger_Transport} */
    const transport = await container.get('TeqFw_Core_Shared_Api_Logger_Transport$');
    base.setTransport(transport);
}
