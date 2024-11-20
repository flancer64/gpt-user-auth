import assert from 'assert';
import {join} from 'path';
import {config as cfgTest, container, dbConnect, RDBMS} from '@teqfw/test';

// SETUP ENVIRONMENT
/** @type {TeqFw_Core_Back_Config} */
let config;
/** @type {TeqFw_Core_Shared_Api_Logger} */
let logger;
/** @type {TeqFw_Db_Back_RDb_Connect} */
let conn;
/** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
let crud;
/** @type {Fl64_Gpt_User_Back_Store_RDb_Schema_User} */
let rdbUser;
/** @type {typeof Fl64_Gpt_User_Shared_Enum_User_Status} */
let STATUS;

before(async () => {
    // Initialize environment configuration
    config = await container.get('TeqFw_Core_Back_Config$');
    config.init(cfgTest.pathToRoot, 'test');
    /**
     * Framework-wide RDB connection from DI. This connection is used by event listeners.
     */
    conn = await container.get('TeqFw_Db_Back_RDb_IConnect$');
    await dbConnect(RDBMS.SQLITE_BETTER, conn);
    crud = await container.get('TeqFw_Db_Back_Api_RDb_CrudEngine$');
    rdbUser = await container.get('Fl64_Gpt_User_Back_Store_RDb_Schema_User$');
    STATUS = await container.get('Fl64_Gpt_User_Shared_Enum_User_Status$');
});

describe('RDb schema', () => {
    before(async () => {
        // Set up console transport for the logger
        /** @type {TeqFw_Core_Shared_Logger_Base} */
        const base = await container.get('TeqFw_Core_Shared_Logger_Base$');
        /** @type {TeqFw_Core_Shared_Api_Logger_Transport} */
        const transport = await container.get('TeqFw_Core_Shared_Api_Logger_Transport$');
        base.setTransport(transport);
        logger = await container.get('TeqFw_Core_Shared_Api_Logger$$');
        // Initialize database structure
        /** @type {{action: TeqFw_Db_Back_Cli_Init.action}} */
        const {action} = await container.get('TeqFw_Db_Back_Cli_Init$');
        const testDems = {
            test: join(config.getPathToRoot(), 'test', 'data'),
        };
        await action({testDems});
    });

    after(async () => {
        await conn.disconnect();
    });

    it('create a user', async () => {
        const trx = await conn.startTransaction();
        try {
            const USER_ID = 1;
            const rdbBase = {
                getAttributes: () => ({ID: 'id'}),
                getEntityName: () => '/user',
                getPrimaryKey: () => ['id'],
            };
            await crud.create(trx, rdbBase, {id: USER_ID});
            const dto = rdbUser.createDto();
            dto.pin = 1024;
            dto.email = 'address@mail.com';
            dto.pass_hash = 'hash';
            dto.pass_salt = 'salt';
            dto.status = STATUS.UNVERIFIED;
            dto.user_ref = USER_ID;
            const {user_ref} = await crud.create(trx, rdbUser, dto);
            await trx.commit();
            // Assertion
            assert.strictEqual(user_ref, USER_ID);
        } catch (e) {
            await trx.rollback();
            logger.exception(e);
        }

    });
});
