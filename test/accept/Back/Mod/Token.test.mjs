import assert from 'assert';
import {createContainer} from '@teqfw/test';
import {dbConnect, dbCreateFkEntities, dbDisconnect, dbReset, initConfig} from '../../common.mjs';

// SETUP CONTAINER
const container = await createContainer();
await initConfig(container);

// SETUP ENVIRONMENT
/** @type {Fl64_Gpt_User_Back_Mod_Token} */
const modToken = await container.get('Fl64_Gpt_User_Back_Mod_Token$');

let USER_ID;
let TOKEN_CODE;
const TOKEN_TYPE = 'some token type';


// Test Suite for User Model
describe('Fl64_Gpt_User_Back_Mod_Token', () => {

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
