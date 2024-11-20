import assert from 'assert';
import {config as cfgTest, container, dbConnect, RDBMS} from '@teqfw/test';
import {join} from 'path';

// SETUP ENVIRONMENT
/** @type {TeqFw_Core_Back_Config} */
let config = await container.get('TeqFw_Core_Back_Config$');
/** @type {TeqFw_Core_Shared_Api_Logger} */
let logger = await container.get('TeqFw_Core_Shared_Api_Logger$$');
/** @type {TeqFw_Db_Back_RDb_Connect} */
let conn = await container.get('TeqFw_Db_Back_RDb_IConnect$');
/** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
let crud = await container.get('TeqFw_Db_Back_Api_RDb_CrudEngine$');
/** @type {Fl64_Gpt_User_Back_Mod_Token} */
const modToken = await container.get('Fl64_Gpt_User_Back_Mod_Token$');

let USER_ID;
let TOKEN_CODE;
const TOKEN_TYPE = 'some token type';

before(async () => {
    // Initialize environment configuration
    config.init(cfgTest.pathToRoot, '0.0.0');

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

// Test Suite for User Model
describe('Fl64_Gpt_User_Back_Mod_Token', () => {

    it('should successfully compose entity and item', async () => {
        const entity = modToken.composeEntity();
        const item = modToken.composeItem();
        // Check if entity and item are correctly composed
        assert.ok(entity, 'Entity should be composed successfully');
        assert.ok(item, 'Item should be composed successfully');
        assert.strictEqual(typeof entity, 'object', 'Composed entity should be of type object');
        assert.strictEqual(typeof item, 'object', 'Composed item should be of type object');
    });

    it('should successfully create a new entry', async () => {
        // Creating a new user entry
        const dto = modToken.composeEntity();
        dto.type = TOKEN_TYPE;
        dto.userRef = USER_ID;
        const created = await modToken.create({dto});
        TOKEN_CODE = created.code;
        // Check if the user entry was created
        assert.ok(created, 'New entry should exist');
        assert.strictEqual(created.userRef, USER_ID, 'User reference should match');
        assert.strictEqual(created.type, TOKEN_TYPE, 'Token type should match');
    });

    it('should read an existing entry by primary key', async () => {
        // Reading the created user entry
        const found = await modToken.read({code: TOKEN_CODE});

        // Check if the user entry was read correctly
        assert.strictEqual(found.userRef, USER_ID, 'User reference should match');
        assert.strictEqual(found.type, TOKEN_TYPE, 'Token type should match');
    });

    it('should throw an error when attempting to update a token entry', async () => {
        const dto = await modToken.read({code: TOKEN_CODE});
        dto.type = 'new type';
        try {
            await modToken.update({dto});
            assert.fail('Expected an error to be thrown, but no error was thrown');
        } catch (err) {
            assert.strictEqual(
                err.message,
                'Updating a token is not allowed. Please delete the existing token and create a new one.',
                'Error message should match the expected value'
            );
        }
    });

    it('should delete an existing user entry by user reference', async () => {
        const dto = await modToken.read({code: TOKEN_CODE});
        assert.ok(dto, 'The entry should exist before deletion');
        const total = await modToken.delete({dto});
        assert.strictEqual(total, 1, 'Exactly one entry should be deleted');

        // Attempt to read the deleted entry
        const deleted = await modToken.read({code: TOKEN_CODE});
        assert.strictEqual(deleted, null, 'The entry should no longer exist after deletion');
    });

});
