import assert from 'assert';
import {createContainer} from '@teqfw/test';
import {dbConnect, dbCreateFkEntities, dbDisconnect, dbReset, initConfig} from '../../../common.mjs';
import {Readable} from 'stream';

// VARS
const EMAIL = process.env.EMAIL ?? 'user@any.domain.in.tld';

// SETUP CONTAINER
const container = await createContainer();
await initConfig(container);

// SETUP ENVIRONMENT
/** @type {Fl64_Gpt_User_Back_Mod_User_Session} */
const modSession = await container.get('Fl64_Gpt_User_Back_Mod_User_Session$');
/** @type {Fl64_Gpt_User_Back_Mod_User} */
const modUser = await container.get('Fl64_Gpt_User_Back_Mod_User$');

let SESSION_ID, USER_ID;

const IP_ADDRESS = '192.168.0.1';
const USER_AGENT = 'Mozilla/5.0';

// Test Suite for User Session Model
describe('Fl64_Gpt_User_Back_Mod_User_Session', () => {

    before(async () => {
        await dbReset(container);
        const {user} = await dbCreateFkEntities(container);
        USER_ID = user.id;
        await dbConnect(container);
        {
            const dto = modUser.composeEntity();
            dto.email = EMAIL;
            dto.locale = 'en-US';
            dto.passHash = 'hash';
            dto.passSalt = 'salt';
            dto.userRef = USER_ID;
            await modUser.create({dto});
        }
    });

    after(async () => {
        await dbDisconnect(container);
    });

    it('should successfully compose entity and item', async () => {
        const entity = modSession.composeEntity();
        const item = modSession.composeItem();
        // Check if entity and item are correctly composed
        assert.ok(entity, 'Entity should be composed successfully');
        assert.ok(item, 'Item should be composed successfully');
        assert.strictEqual(typeof entity, 'object', 'Composed entity should be of type object');
        assert.strictEqual(typeof item, 'object', 'Composed item should be of type object');
    });

    it('should successfully create a new user session entry', async () => {
        // Creating a new user session entry
        const dto = modSession.composeEntity();
        dto.ipAddress = IP_ADDRESS;
        dto.userAgent = USER_AGENT;
        dto.userRef = USER_ID;

        const newSession = await modSession.create({dto});
        SESSION_ID = newSession.sessionId;

        // Check if the session entry was created
        assert.ok(newSession, 'User session entry should exist');
        assert.strictEqual(newSession.ipAddress, IP_ADDRESS, 'User session IP address should match');
    });

    it('should read an existing user session entry by session ID', async () => {
        // Reading the created user session entry
        const foundSession = await modSession.read({sessionId: SESSION_ID});

        // Check if the session entry was read correctly
        assert.strictEqual(foundSession.sessionId, SESSION_ID, 'User session ID should match');
        assert.strictEqual(foundSession.ipAddress, IP_ADDRESS, 'User session IP address should match');
    });

    it('should retrieve an existing session using getSessionFromRequest', async () => {
        // Mock HTTP request with sessionId in cookies
        const mockReq = new Readable({
            read() {}
        });
        mockReq.headers = {
            cookie: `sessionId=${SESSION_ID}`,
        };

        // Call the new method
        const foundSession = await modSession.getSessionFromRequest({req: mockReq});

        // Assertions
        assert.ok(foundSession, 'User session should be found from the request');
        assert.strictEqual(foundSession.sessionId, SESSION_ID, 'User session ID should match');
        assert.strictEqual(foundSession.ipAddress, IP_ADDRESS, 'User session IP address should match');
        assert.strictEqual(foundSession.userAgent, USER_AGENT, 'User session User-Agent should match');
    });

    it('should return null if no sessionId is found in cookies', async () => {
        // Mock HTTP request without sessionId in cookies
        const mockReq = new Readable({
            read() {}
        });
        mockReq.headers = {
            cookie: '',
        };

        // Call the new method
        const foundSession = await modSession.getSessionFromRequest({req: mockReq});

        // Assertions
        assert.strictEqual(foundSession, null, 'User session should not be found if no sessionId is present');
    });

    it('should return null if cookies are missing', async () => {
        // Mock HTTP request without cookies header
        const mockReq = new Readable({
            read() {}
        });
        mockReq.headers = {};

        // Call the new method
        const foundSession = await modSession.getSessionFromRequest({req: mockReq});

        // Assertions
        assert.strictEqual(foundSession, null, 'User session should not be found if cookies header is missing');
    });

    it('should update an existing user session entry', async () => {

        // Updating the created user session entry
        const dto = await modSession.read({sessionId: SESSION_ID});
        dto.ipAddress = '192.168.0.2';
        const updated = await modSession.update({dto});

        // Verify the update
        assert.strictEqual(updated.ipAddress, '192.168.0.2', 'User session IP address should be updated');
    });

    it('should delete an existing user session entry by session ID', async () => {
        // Deleting the created user session entry
        const dto = await modSession.read({sessionId: SESSION_ID});
        assert.ok(dto, 'User session entry should exist before deletion');
        const total = await modSession.delete({dto});
        assert.strictEqual(total, 1, 'One user session entry should be deleted');

        // Attempt to read deleted entry
        const removedSession = await modSession.read({sessionId: SESSION_ID});
        assert.strictEqual(removedSession, null, 'User session entry should be deleted');
    });


});
