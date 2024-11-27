import {createContainer} from '@teqfw/test';
import {dbConnect, dbCreateFkEntities, dbDisconnect, dbReset, initConfig} from '../../../../common.mjs';
import assert from 'node:assert';
import {describe, it} from 'mocha';

// Constants
const EMAIL = process.env.EMAIL ?? 'user@any.domain.in.tld';
const PASS_PHRASE = process.env.PASS_PHRASE ?? 'some password is here';

// Container setup
const container = await createContainer();
await initConfig(container);

// Service and endpoint instances
/** @type {Fl64_Gpt_User_Back_Web_Api_Update_Save} */
const service = await container.get('Fl64_Gpt_User_Back_Web_Api_Update_Save$');
/** @type {Fl64_Gpt_User_Shared_Web_Api_Update_Save} */
const endpoint = await container.get('Fl64_Gpt_User_Shared_Web_Api_Update_Save$');
const RESULT_CODE = endpoint.getResultCodes();

/** @type {Fl64_Gpt_User_Back_Mod_User} */
const modUser = await container.get('Fl64_Gpt_User_Back_Mod_User$');
/** @type {Fl64_Gpt_User_Back_Mod_Token} */
const modToken = await container.get('Fl64_Gpt_User_Back_Mod_Token$');
/** @type {typeof Fl64_Gpt_User_Shared_Enum_Token_Type} */
const TOKEN_TYPE = await container.get('Fl64_Gpt_User_Shared_Enum_Token_Type.default');

describe('Fl64_Gpt_User_Back_Web_Api_Update_Save', () => {
    describe('#process', () => {
        let USER_ID, PIN, TOKEN, TOKEN_OTHER;
        /** @type {Fl64_Gpt_User_Shared_Dto_User.Dto} */
        let userDb;
        const LOCALE_EN = 'en-US';
        const LOCALE_ES = 'es-ES';

        before(async function () {
            this.timeout(60000);
            await dbReset(container);
            const {user} = await dbCreateFkEntities(container);
            USER_ID = user.id;
            await dbConnect(container);

            // Create a mock user
            const salt = 'salt';
            const dtoUser = modUser.composeEntity();
            dtoUser.email = EMAIL;
            dtoUser.locale = LOCALE_EN;
            dtoUser.passHash = modUser.hashPassPhrase({passPhrase: PASS_PHRASE, salt});
            dtoUser.passSalt = salt;
            dtoUser.userRef = USER_ID;
            userDb = await modUser.create({dto: dtoUser});
            PIN = userDb.pin;

            // Create a valid token for profile update
            const dtoToken = modToken.composeEntity();
            dtoToken.type = TOKEN_TYPE.PROFILE_EDIT;
            dtoToken.userRef = USER_ID;
            const createdToken = await modToken.create({dto: dtoToken});
            TOKEN = createdToken.code;

            // Create a token with a different type
            const dtoTokenOther = modToken.composeEntity();
            dtoTokenOther.type = TOKEN_TYPE.EMAIL_VERIFICATION;
            dtoTokenOther.userRef = USER_ID;
            const createdTokenOther = await modToken.create({dto: dtoTokenOther});
            TOKEN_OTHER = createdTokenOther.code;
        });

        after(async () => {
            await dbDisconnect(container);
        });

        it('should return INVALID_TOKEN when no token is provided', async () => {
            const req = endpoint.createReq();
            const res = endpoint.createRes();
            await service.process(req, res, null);
            assert.strictEqual(res.resultCode, RESULT_CODE.INVALID_TOKEN);
        });

        it('should return INVALID_TOKEN when the token is not found', async () => {
            const req = endpoint.createReq();
            req.token = 'invalid-token';
            const res = endpoint.createRes();
            await service.process(req, res, null);
            assert.strictEqual(res.resultCode, RESULT_CODE.INVALID_TOKEN);
        });

        it('should return INVALID_TOKEN when the token type is not PROFILE_EDIT', async () => {
            const req = endpoint.createReq();
            req.token = TOKEN_OTHER;
            const res = endpoint.createRes();
            await service.process(req, res, null);
            assert.strictEqual(res.resultCode, RESULT_CODE.INVALID_TOKEN);
        });

        it('should return SUCCESS when profile update is completed successfully', async () => {
            const req = endpoint.createReq();
            req.token = TOKEN;
            req.locale = LOCALE_ES;
            req.passphrase = PASS_PHRASE + 'new';
            const res = endpoint.createRes();

            await service.process(req, res, null);
            assert.strictEqual(res.resultCode, RESULT_CODE.SUCCESS);

            // Verify updated user data in the database
            const updatedDto = await modUser.read({userRef: USER_ID});
            assert.strictEqual(updatedDto.dateCreated.getTime(), userDb.dateCreated.getTime());
            assert.strictEqual(updatedDto.email, userDb.email);
            assert.strictEqual(updatedDto.locale, LOCALE_ES);
            assert.strictEqual(updatedDto.pin, userDb.pin);
            assert.strictEqual(updatedDto.status, userDb.status);

            const hash = modUser.hashPassPhrase({
                passPhrase: req.passphrase,
                salt: updatedDto.passSalt,
            });
            assert.strictEqual(updatedDto.passHash, hash);

            // Verify the token was deleted
            const foundToken = await modToken.read({code: TOKEN});
            assert.strictEqual(foundToken, null);
        });

        it('should return SERVER_ERROR when an unexpected error occurs', async () => {
            const originalRead = modToken.read.bind(modToken);
            modToken.read = () => { throw new Error('test error'); };

            const req = endpoint.createReq();
            req.token = TOKEN;
            const res = endpoint.createRes();

            await service.process(req, res, null);
            assert.strictEqual(res.resultCode, RESULT_CODE.SERVER_ERROR);

            modToken.read = originalRead;
        });

    });

    describe('#getEndpoint', () => {
        it('should return the correct endpoint instance', async () => {
            const endpointInstance = service.getEndpoint();
            assert.strictEqual(endpointInstance.constructor.name, 'Fl64_Gpt_User_Shared_Web_Api_Update_Save');
        });
    });

    describe('#init', () => {
        it('should initialize without errors', async () => {
            try {
                await service.init();
                assert(true);
            } catch (error) {
                assert.fail('Initialization failed with an error');
            }
        });
    });
});
