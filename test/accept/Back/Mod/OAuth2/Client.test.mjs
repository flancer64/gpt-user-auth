import assert from 'assert';
import {createContainer} from '@teqfw/test';
import {dbConnect, dbDisconnect, dbReset, initConfig} from '../../../common.mjs';

// SETUP CONTAINER
const container = await createContainer();
await initConfig(container);

// SETUP ENVIRONMENT
/** @type {Fl64_Gpt_User_Back_Mod_OAuth2_Client} */
const modClient = await container.get('Fl64_Gpt_User_Back_Mod_OAuth2_Client$');

let ID;

const CLIENT_ID = `client-${Date.now()}`;
const CLIENT_NAME = 'Test Client';
const CLIENT_NAME_UPDATED = 'Updated Client';
const REDIRECT_URI = 'https://example.com/callback';
const REDIRECT_URI_UPDATED = 'https://example.com/updated-callback';

// Test Suite for OAuth2 Client Model
describe('Fl64_Gpt_User_Back_Mod_OAuth2_Client', () => {
    before(async () => {
        await dbReset(container);
        await dbConnect(container);
    });

    after(async () => {
        await dbDisconnect(container);
    });

    it('should successfully compose entity and item', async () => {
        const entity = modClient.composeEntity();
        const item = modClient.composeItem();
        // Check if entity and item are correctly composed
        assert.ok(entity, 'Entity should be composed successfully');
        assert.ok(item, 'Item should be composed successfully');
        assert.strictEqual(typeof entity, 'object', 'Composed entity should be of type object');
        assert.strictEqual(typeof item, 'object', 'Composed item should be of type object');
    });

    it('should successfully create a new client entry', async () => {
        // Creating a new client entry
        const dto = modClient.composeEntity();
        dto.clientId = CLIENT_ID;
        dto.clientSecret = 'secret';
        dto.name = CLIENT_NAME;
        dto.redirectUri = REDIRECT_URI;

        const newClient = await modClient.create({dto});
        ID = newClient.id;

        // Check if the client entry was created
        assert.ok(newClient, 'Client entry should exist');
        assert.strictEqual(newClient.name, CLIENT_NAME, 'Client name should match');
    });

    it('should read an existing client entry by client ID', async () => {
        // Reading the created client entry
        const foundClient = await modClient.read({id: ID});

        // Check if the client entry was read correctly
        assert.strictEqual(foundClient.clientId, CLIENT_ID, 'Client ID should match');
        assert.strictEqual(foundClient.name, CLIENT_NAME, 'Client name should match');
    });

    it('should update an existing client entry', async () => {
        // Updating the created client entry
        const dto = await modClient.read({id: ID});
        dto.name = CLIENT_NAME_UPDATED;
        dto.redirectUri = REDIRECT_URI_UPDATED;
        const updated = await modClient.update({dto});

        // Verify the update
        assert.strictEqual(updated.name, CLIENT_NAME_UPDATED, 'Client name should be updated');
        assert.strictEqual(updated.redirectUri, REDIRECT_URI_UPDATED, 'Client redirect URI should be updated');
    });

    it('should list all client entries', async () => {
        /** @type {Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Client} */
        const rdbClient = await container.get('Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Client$');
        const ATTR = rdbClient.getAttributes();

        let clients = await modClient.list();
        assert.strictEqual(clients.length, 1, 'The total number of clients should match the created entries.');

        clients = await modClient.list({where: {[ATTR.NAME]: CLIENT_NAME_UPDATED}});
        assert.strictEqual(clients.length, 1, 'The number of clients should match those associated with the given name.');
    });

    it('should delete an existing client entry by client ID', async () => {
        // Deleting the created client entry
        const dto = await modClient.read({id: ID});
        assert.ok(dto, 'Client entry should exist before deletion');
        const total = await modClient.delete({dto});
        assert.strictEqual(total, 1, 'One client entry should be deleted');

        // Attempt to read deleted entry
        const removedClient = await modClient.read({id: ID});
        assert.strictEqual(removedClient, null, 'Client entry should be deleted');
    });
});
