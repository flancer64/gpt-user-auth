import assert from 'assert';
import {join} from 'path';
import {config as cfgTest, container, dbConnect, RDBMS} from '@teqfw/test';

// SETUP ENVIRONMENT
/** @type {TeqFw_Core_Back_Config} */
let config = await container.get('TeqFw_Core_Back_Config$');
/** @type {TeqFw_Core_Shared_Api_Logger} */
let logger = await container.get('TeqFw_Core_Shared_Api_Logger$$');
/** @type {TeqFw_Db_Back_RDb_Connect} */
let conn = await container.get('TeqFw_Db_Back_RDb_IConnect$');
/** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
let crud = await container.get('TeqFw_Db_Back_Api_RDb_CrudEngine$');
/** @type {Fl64_Gpt_User_Back_Store_RDb_Schema_Token} */
let rdbToken = await container.get('Fl64_Gpt_User_Back_Store_RDb_Schema_Token$');
/** @type {Fl64_Gpt_User_Back_Store_RDb_Schema_User} */
let rdbUser = await container.get('Fl64_Gpt_User_Back_Store_RDb_Schema_User$');
/** @type {typeof Fl64_Gpt_User_Shared_Enum_User_Status} */
let STATUS = await container.get('Fl64_Gpt_User_Shared_Enum_User_Status.default');

let USER_ID;

before(async () => {
    // Initialize environment configuration
    config.init(cfgTest.pathToRoot, 'test');

    // Set up console transport for the logger
    const base = await container.get('TeqFw_Core_Shared_Logger_Base$');
    const transport = await container.get('TeqFw_Core_Shared_Api_Logger_Transport$');
    base.setTransport(transport);

    // Framework-wide RDB connection from DI
    await dbConnect(RDBMS.SQLITE_BETTER, conn);

    // Initialize database structure
    /** @type {{action: TeqFw_Db_Back_Cli_Init.action}} */
    const {action} = await container.get('TeqFw_Db_Back_Cli_Init$');
    const testDems = {
        test: join(config.getPathToRoot(), 'test', 'data'),
    };
    await action({testDems});

    // Create an app user
    const trx = await conn.startTransaction();
    try {
        const rdbBase = {
            getAttributes: () => ({ID: 'id'}),
            getEntityName: () => '/user',
            getPrimaryKey: () => ['id'],
        };
        const {id} = await crud.create(trx, rdbBase, {id: USER_ID});
        await trx.commit();
        USER_ID = id;
    } catch (e) {
        await trx.rollback();
        logger.exception(e);
    }
});

after(async () => {
    await conn.disconnect();
});

describe('RDb schema', () => {

    it('should create a user', async () => {
        const trx = await conn.startTransaction();
        try {
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

    it('should create a token', async () => {
        const trx = await conn.startTransaction();
        try {
            const dto = rdbToken.createDto();
            dto.user_ref = USER_ID;
            dto.type = 'TEST_TYPE';
            dto.code = 'TOKEN CODE';
            const {user_ref} = await crud.create(trx, rdbToken, dto);
            await trx.commit();
            // Assertion
            assert.strictEqual(user_ref, USER_ID);
        } catch (e) {
            await trx.rollback();
            logger.exception(e);
        }
    });
});
