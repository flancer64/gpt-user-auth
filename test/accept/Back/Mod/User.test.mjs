import assert from 'assert';
import {config as cfgTest, container, dbConnect, RDBMS} from '@teqfw/test';
import {join} from 'path';

// SETUP ENVIRONMENT
/** @type {TeqFw_Core_Back_Config} */
const config = await container.get('TeqFw_Core_Back_Config$');
/** @type {TeqFw_Core_Shared_Api_Logger} */
const logger = await container.get('TeqFw_Core_Shared_Api_Logger$$');
/** @type {TeqFw_Db_Back_RDb_Connect} */
const conn = await container.get('TeqFw_Db_Back_RDb_IConnect$');
/** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
const crud = await container.get('TeqFw_Db_Back_Api_RDb_CrudEngine$');
/** @type {Fl64_Gpt_User_Back_Mod_User} */
const modUser = await container.get('Fl64_Gpt_User_Back_Mod_User$');

let USER_ID;
const EMAIL = 'alex@flancer64.com';
const EMAIL_UPDATED = 'alex@flancer32.com';

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
describe('Fl64_Gpt_User_Back_Mod_User', () => {

    it('should successfully compose entity and item', async () => {
        const entity = modUser.composeEntity();
        const item = modUser.composeItem();
        // Check if entity and item are correctly composed
        assert.ok(entity, 'Entity should be composed successfully');
        assert.ok(item, 'Item should be composed successfully');
        assert.strictEqual(typeof entity, 'object', 'Composed entity should be of type object');
        assert.strictEqual(typeof item, 'object', 'Composed item should be of type object');
    });

    it('should successfully create a new user entry', async () => {
        // Creating a new user entry
        const dto = modUser.composeEntity();
        dto.userRef = USER_ID;
        dto.email = EMAIL;
        dto.passHash = 'hash';
        dto.passSalt = 'salt';
        const newUser = await modUser.create({dto});

        // Check if the user entry was created
        assert.ok(newUser, 'User entry should exist');
        assert.strictEqual(newUser.email, EMAIL, 'User email should match');
    });

    it('should read an existing user entry by user reference', async () => {
        // Reading the created user entry
        const foundUser = await modUser.read({userRef: USER_ID});

        // Check if the user entry was read correctly
        assert.strictEqual(foundUser.userRef, USER_ID, 'User reference should match');
        assert.strictEqual(foundUser.email, EMAIL, 'User email should match');
    });

    it('should update an existing user entry', async () => {

        // Updating the created user entry
        const dto = await modUser.read({userRef: USER_ID});
        dto.email = EMAIL_UPDATED;
        const updated = await modUser.update({dto});

        // Verify the update
        assert.strictEqual(updated.email, EMAIL_UPDATED, 'User email should be updated');
    });

    it('should delete an existing user entry by user reference', async () => {
        // Deleting the created user entry
        const dto = await modUser.read({userRef: USER_ID});
        assert.ok(dto, 'User entry should exist before deletion');
        const total = await modUser.delete({dto});
        assert.strictEqual(total, 1, 'One user entry should be deleted');

        // Attempt to read deleted entry
        const removedUser = await modUser.read({userRef: USER_ID});
        assert.strictEqual(removedUser, null, 'User entry should be deleted');
    });
});
