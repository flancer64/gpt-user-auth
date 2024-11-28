import assert from 'assert';
import {createContainer} from '@teqfw/test';
import {dbConnect, dbCreateFkEntities, dbDisconnect, dbReset, initConfig} from '../../common.mjs';

// SETUP CONTAINER
const container = await createContainer();
await initConfig(container);

// SETUP ENVIRONMENT
/** @type {Fl64_Gpt_User_Back_Mod_User} */
const modUser = await container.get('Fl64_Gpt_User_Back_Mod_User$');

let USER_ID;

const EMAIL = 'alex@flancer64.com';
const EMAIL_UPDATED = 'alex@flancer32.com';
const LOCALE = 'es-ES';
const LOCALE_UPDATED = 'en-US';

// Test Suite for User Model
describe('Fl64_Gpt_User_Back_Mod_User', () => {

    before(async () => {
        await dbReset(container);
        const {user} = await dbCreateFkEntities(container);
        USER_ID = user.id;
        await dbConnect(container);
    });

    after(async () => {
        await dbDisconnect(container);
    });

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
        dto.email = EMAIL;
        dto.locale = LOCALE;
        dto.passHash = 'hash';
        dto.passSalt = 'salt';
        dto.userRef = USER_ID;

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
        dto.locale = LOCALE_UPDATED;
        const updated = await modUser.update({dto});

        // Verify the update
        assert.strictEqual(updated.email, EMAIL_UPDATED, 'User email should be updated');
        assert.strictEqual(updated.locale, LOCALE_UPDATED, 'User locale should be updated');
    });

    it('should list all user entries', async () => {
        // Retrieve all users
        const users = await modUser.list();
        assert.strictEqual(users.length, 1, 'The number of listed users should match the created users');
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
