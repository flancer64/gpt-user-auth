import assert from 'assert';
import {createContainer} from '@teqfw/test';
import {dbConnect, dbCreateFkEntities, dbDisconnect, dbReset, initConfig} from '../../../common.mjs';

// VARS
const EMAIL = process.env.EMAIL ?? 'user@any.domain.in.tld';

// SETUP CONTAINER
const container = await createContainer();
await initConfig(container);

// SETUP ENVIRONMENT
/** @type {Fl64_Gpt_User_Back_Mod_OAuth2_Token} */
const modToken = await container.get('Fl64_Gpt_User_Back_Mod_OAuth2_Token$');
/** @type {Fl64_Gpt_User_Back_Mod_OAuth2_Client} */
const modClient = await container.get('Fl64_Gpt_User_Back_Mod_OAuth2_Client$');
/** @type {Fl64_Gpt_User_Back_Mod_User} */
const modUser = await container.get('Fl64_Gpt_User_Back_Mod_User$');

// Working variables
let CLIENT_ID, USER_ID, TOKEN_ID;

// Constants
const REDIRECT_URI = 'https://example.com/redirect';

describe('Fl64_Gpt_User_Back_Mod_OAuth2_Token', () => {
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

    it('should create a new OAuth2 token', async () => {
        const dto = modToken.composeEntity();
        dto.accessToken = 'testAccessToken';
        dto.refreshToken = 'testRefreshToken';
        dto.clientRef = CLIENT_ID;
        dto.userRef = USER_ID;
        dto.dateExpire = new Date('2024-01-01T12:00:00Z');
        dto.scope = 'read';

        const createdToken = await modToken.create({dto});
        TOKEN_ID = createdToken.id;
        assert.ok(createdToken, 'Token should be created successfully');
        assert.strictEqual(createdToken.accessToken, 'testAccessToken', 'Access token should match');
    });

    it('should read an existing OAuth2 token', async () => {
        const dto = await modToken.read({tokenId: TOKEN_ID});
        assert.ok(dto, 'Token should be read successfully');
        assert.strictEqual(dto.accessToken, 'testAccessToken', 'Access token should match');
    });

    it('should update an existing OAuth2 token', async () => {
        const dto = await modToken.read({tokenId: TOKEN_ID});
        dto.scope = 'write';

        const updatedToken = await modToken.update({dto});
        assert.ok(updatedToken, 'Token should be updated successfully');
        assert.strictEqual(updatedToken.scope, 'write', 'Scope should match updated value');
    });

    it('should list all OAuth2 tokens', async () => {
        const tokens = await modToken.list();
        assert.ok(Array.isArray(tokens), 'Result should be an array');
        assert.strictEqual(tokens.length, 1, 'There should be one token');
    });

    it('should delete an existing OAuth2 token', async () => {
        const result = await modToken.delete({tokenId: TOKEN_ID});
        assert.strictEqual(result, 1, 'One token should be deleted');
    });
});
