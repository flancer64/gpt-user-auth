import {createContainer} from '@teqfw/test';
import assert from 'node:assert';

const container = await createContainer();
/** @type {Fl64_Gpt_User_Back_Mod_Auth} */
const modAuth = await container.get('Fl64_Gpt_User_Back_Mod_Auth$');
/** @type {Fl64_Gpt_User_Back_Defaults} */
const DEF = await container.get('Fl64_Gpt_User_Back_Defaults$');

const TOKEN = 'valid-token';
const OAI_USER_ID = 'oai-user-id';

describe('Fl64_Gpt_User_Back_Mod_Auth - Unit Tests', () => {

    before(async () => {
        const config = await container.get('TeqFw_Core_Back_Config$');
        config.getLocal = () => ({authBearerTokens: [TOKEN]});
    });

    it('should return true for a valid Bearer token and user ID from Open AI', async () => {
        const req = {
            headers: {
                authorization: `Bearer ${TOKEN}`,
                [DEF.HTTP_HEAD_OPENAI_EPHEMERAL_USER_ID]: OAI_USER_ID,
            },
        };

        const result = await modAuth.isValidRequest(req);
        assert.strictEqual(result, true, 'Expected true for a valid Bearer token and user ID from Open AI');
    });

    it('should return false if Open AI header is missed', async () => {
        const req = {
            headers: {
                authorization: `Bearer ${TOKEN}`
            },
        };
        const result = await modAuth.isValidRequest(req);
        assert.strictEqual(result, false, 'Expected false for missed Open AI header');
    });

    it('should return false for an invalid Bearer token', async () => {
        const req = {
            headers: {
                authorization: 'Bearer invalid-token',
                [DEF.HTTP_HEAD_OPENAI_EPHEMERAL_USER_ID]: OAI_USER_ID,
            },
        };
        const result = await modAuth.isValidRequest(req);
        assert.strictEqual(result, false, 'Expected false for an invalid Bearer token');
    });

    it('should return false if no Bearer token is provided', async () => {
        const req = {
            headers: {
                [DEF.HTTP_HEAD_OPENAI_EPHEMERAL_USER_ID]: OAI_USER_ID,
            },
        };
        const result = await modAuth.isValidRequest(req);
        assert.strictEqual(result, false, 'Expected false if no Bearer token is provided');
    });

    it('should load user if credentials match', async () => {
        const mockUser = {
            pin: '1234',
            passHash: 'hashed-passphrase',
            passSalt: 'salt',
            status: 'ACTIVE',
        };

        const modUser = await container.get('Fl64_Gpt_User_Back_Mod_User$');
        modUser.read = async () => mockUser;
        modUser.hashPassPhrase = () => 'hashed-passphrase';

        const trx = {};
        const pin = '1234';
        const passPhrase = 'secret';

        const result = await modAuth.loadUser({trx, pin, passPhrase});
        assert.deepStrictEqual(result, mockUser, 'Expected user to be loaded with valid credentials');
    });

    it('should return null if user credentials do not match', async () => {
        const mockUser = {
            pin: '1234',
            passHash: 'hashed-passphrase',
            passSalt: 'salt',
            status: 'ACTIVE',
        };

        const modUser = await container.get('Fl64_Gpt_User_Back_Mod_User$');
        modUser.read = async () => mockUser;
        modUser.hashPassPhrase = () => 'wrong-hash';

        const trx = {};
        const pin = '1234';
        const passPhrase = 'wrong-secret';

        const result = await modAuth.loadUser({trx, pin, passPhrase});
        assert.strictEqual(result, null, 'Expected undefined for invalid credentials');
    });

    it('should return null if user is not found', async () => {
        const modUser = await container.get('Fl64_Gpt_User_Back_Mod_User$');
        modUser.read = async () => null;

        const trx = {};
        const pin = '1234';
        const passPhrase = 'secret';

        const result = await modAuth.loadUser({trx, pin, passPhrase});
        assert.strictEqual(result, null, 'Expected null if user is not found');
    });
});
