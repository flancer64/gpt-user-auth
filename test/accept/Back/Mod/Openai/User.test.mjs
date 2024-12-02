import assert from 'assert';
import {createContainer} from '@teqfw/test';
import {dbConnect, dbCreateFkEntities, dbDisconnect, dbReset, initConfig} from '../../../common.mjs';

// SETUP CONTAINER
const container = await createContainer();
await initConfig(container);

// SETUP ENVIRONMENT
/** @type {Fl64_Gpt_User_Back_Mod_Openai_User} */
const modOpenaiUser = await container.get('Fl64_Gpt_User_Back_Mod_Openai_User$');

let USER_ID;

const CODE = 'auth_code_123';
const CODE_UPDATED = 'auth_code_456';
const DATE_CREATED = new Date('2023-01-01T00:00:00Z');
const DATE_LAST = new Date('2023-01-02T00:00:00Z');
const DATE_LAST_UPDATED = new Date('2023-01-03T00:00:00Z');

// Test Suite for OpenAI User Model
describe('Fl64_Gpt_User_Back_Mod_Openai_User', () => {

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
        const entity = modOpenaiUser.composeEntity();
        const item = modOpenaiUser.composeItem();
        // Check if entity and item are correctly composed
        assert.ok(entity, 'Entity should be composed successfully');
        assert.ok(item, 'Item should be composed successfully');
        assert.strictEqual(typeof entity, 'object', 'Composed entity should be of type object');
        assert.strictEqual(typeof item, 'object', 'Composed item should be of type object');
    });

    it('should successfully create a new OpenAI user entry', async () => {
        // Creating a new OpenAI user entry
        const dto = modOpenaiUser.composeEntity();
        dto.code = CODE;
        dto.dateCreated = DATE_CREATED;
        dto.dateLast = DATE_LAST;
        dto.userRef = USER_ID;

        const newUser = await modOpenaiUser.create({dto});

        // Check if the user entry was created
        assert.ok(newUser, 'OpenAI user entry should exist');
        assert.strictEqual(newUser.code, CODE, 'OpenAI user code should match');
    });

    it('should read an existing OpenAI user entry by user reference', async () => {
        // Reading the created OpenAI user entry
        const foundUser = await modOpenaiUser.read({userRef: USER_ID});

        // Check if the OpenAI user entry was read correctly
        assert.strictEqual(foundUser.userRef, USER_ID, 'User reference should match');
        assert.strictEqual(foundUser.code, CODE, 'OpenAI user code should match');
    });

    it('should update an existing OpenAI user entry', async () => {
        // Updating the created OpenAI user entry
        const dto = await modOpenaiUser.read({userRef: USER_ID});
        dto.code = CODE_UPDATED;
        dto.dateLast = DATE_LAST_UPDATED;
        const updated = await modOpenaiUser.update({dto});

        // Verify the update
        assert.strictEqual(updated.code, CODE_UPDATED, 'OpenAI user code should be updated');
        assert.strictEqual(updated.dateLast.toISOString(), DATE_LAST_UPDATED.toISOString(), 'OpenAI user last interaction date should be updated');
    });

    it('should list all OpenAI user entries', async () => {
        /** @type {Fl64_Gpt_User_Back_Store_RDb_Schema_Openai_User} */
        const rdbOpenaiUser = await container.get('Fl64_Gpt_User_Back_Store_RDb_Schema_Openai_User$');
        const ATTR = rdbOpenaiUser.getAttributes();

        let users = await modOpenaiUser.list();
        assert.strictEqual(users.length, 1, 'The total number of OpenAI users should match the created entries.');

        users = await modOpenaiUser.list({where: {[ATTR.CODE]: CODE_UPDATED}});
        assert.strictEqual(users.length, 1, 'The number of OpenAI users should match those associated with the given code.');
    });

    it('should delete an existing OpenAI user entry by user reference', async () => {
        // Deleting the created OpenAI user entry
        const dto = await modOpenaiUser.read({userRef: USER_ID});
        assert.ok(dto, 'OpenAI user entry should exist before deletion');
        const total = await modOpenaiUser.delete({dto});
        assert.strictEqual(total, 1, 'One OpenAI user entry should be deleted');

        // Attempt to read deleted entry
        const removedUser = await modOpenaiUser.read({userRef: USER_ID});
        assert.strictEqual(removedUser, null, 'OpenAI user entry should be deleted');
    });
});
