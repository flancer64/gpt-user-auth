import assert from 'assert';
import {createContainer} from '@teqfw/test';
import {dbConnect, dbCreateFkEntities, dbDisconnect, dbReset, initConfig} from '../../../common.mjs';

// VARS
const EMAIL = process.env.EMAIL ?? 'user@any.domain.in.tld';

// SETUP CONTAINER
const container = await createContainer();
await initConfig(container);

// SETUP ENVIRONMENT
/** @type {Fl64_Gpt_User_Back_Mod_OAuth2_Code} */
const modCode = await container.get('Fl64_Gpt_User_Back_Mod_OAuth2_Code$');
/** @type {Fl64_Gpt_User_Back_Mod_OAuth2_Client} */
const modClient = await container.get('Fl64_Gpt_User_Back_Mod_OAuth2_Client$');
/** @type {Fl64_Gpt_User_Back_Mod_User} */
const modUser = await container.get('Fl64_Gpt_User_Back_Mod_User$');

// Working variables
let CLIENT_ID, USER_ID;

// Constants
const CODE = 'sample-code';
const EXPIRES_AT = new Date(Date.now() + 3600000); // 1 hour from now
const REDIRECT_URI = 'https://example.com/redirect';
const SCOPE = 'read,write';

// Test Suite for OAuth2 Code Model
describe('Fl64_Gpt_User_Back_Mod_OAuth2_Code', () => {
    before(async () => {
        await dbReset(container);
        const {user} = await dbCreateFkEntities(container);
        USER_ID = user.id;
        await dbConnect(container);
        {
            const dto = modClient.composeEntity();
            dto.clientId = 'TEST_CLIENT_ID';
            dto.clientSecret = 'secret';
            dto.name = 'test client';
            dto.redirectUri = REDIRECT_URI;
            const created = await modClient.create({dto});
            CLIENT_ID = created.id;
        }
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

    it('should create a new OAuth2 code entry', async () => {
        const dto = modCode.composeEntity();
        dto.clientId = CLIENT_ID;
        dto.userId = USER_ID;
        dto.code = CODE;
        dto.expiresAt = EXPIRES_AT;
        dto.redirectUri = REDIRECT_URI;
        dto.scope = SCOPE;

        const created = await modCode.create({dto});

        assert.ok(created, 'Created entry should exist');
        assert.strictEqual(created.code, CODE, 'Code should match');
        assert.strictEqual(created.clientId, CLIENT_ID, 'Client ID should match');
    });

    it('should read an existing OAuth2 code entry', async () => {
        const read = await modCode.read({id: 1});

        assert.ok(read, 'Read entry should exist');
        assert.strictEqual(read.code, CODE, 'Code should match');
        assert.strictEqual(read.clientId, CLIENT_ID, 'Client ID should match');
    });

    it('should list all OAuth2 code entries', async () => {
        const list = await modCode.list();

        assert.strictEqual(list.length, 1, 'There should be one entry in the list');
        assert.strictEqual(list[0].code, CODE, 'Listed code should match');
    });

    it('should delete an OAuth2 code entry', async () => {
        const deleted = await modCode.delete({id: 1});

        assert.strictEqual(deleted, 1, 'One entry should be deleted');
        const read = await modCode.read({id: 1});
        assert.strictEqual(read, null, 'Deleted entry should no longer exist');
    });
});
