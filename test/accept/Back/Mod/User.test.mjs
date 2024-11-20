import assert from 'assert';
import {config as cfgTest, container, dbConnect, RDBMS} from '@teqfw/test';

// SETUP ENVIRONMENT
/** @type {TeqFw_Db_Back_RDb_Connect} */
let dbConn;
/** @type {Fl64_Gpt_User_Back_Mod_User} */
const modUser = await container.get('Fl64_Gpt_User_Back_Mod_User$');

let USER_ID;
const EMAIL = 'alex@flancer64.com';
const EMAIL_UPDATED = 'alex@flancer32.com';

before(async () => {
    // Set up console transport for the logger
    const base = await container.get('TeqFw_Core_Shared_Logger_Base$');
    const transport = await container.get('TeqFw_Core_Shared_Api_Logger_Transport$');
    base.setTransport(transport);

    // Initialize environment configuration
    /** @type {TeqFw_Core_Back_Config} */
    const config = await container.get('TeqFw_Core_Back_Config$');
    config.init(cfgTest.pathToRoot, 'test');

    // Framework-wide RDB connection from DI
    dbConn = await container.get('TeqFw_Db_Back_RDb_IConnect$');
    await dbConnect(RDBMS.SQLITE_BETTER, dbConn);

    // Initialize database structure
    const cliInit = await container.get('TeqFw_Db_Back_Cli_Init$');
    await cliInit.action();

    // Create an app user
    const dto = modUserApp.composeEntity();
    dto.dateBirth = new Date('1973/01/01');
    dto.gender = 'MALE';
    dto.height = 175;
    dto.name = 'User Test';
    dto.weightCurrent = 93000;
    const user = await modUserApp.create({dto});
    USER_ID = user.id;
});

after(async () => {
    await dbConn.disconnect();
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
