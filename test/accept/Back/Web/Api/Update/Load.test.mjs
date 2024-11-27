import {createContainer} from '@teqfw/test';
import {dbConnect, dbCreateFkEntities, dbDisconnect, dbReset, initConfig} from '../../../../common.mjs';
import assert from 'node:assert';

// Constants
const EMAIL = process.env.EMAIL ?? 'user@any.domain.in.tld';

// Container setup
const container = await createContainer();
await initConfig(container);

// Service and endpoint instances
/** @type {Fl64_Gpt_User_Back_Web_Api_Update_Load} */
const service = await container.get('Fl64_Gpt_User_Back_Web_Api_Update_Load$');
/** @type {Fl64_Gpt_User_Shared_Web_Api_Update_Load} */
const endpoint = await container.get('Fl64_Gpt_User_Shared_Web_Api_Update_Load$');
const RESULT_CODE = endpoint.getResultCodes();

/** @type {Fl64_Gpt_User_Back_Mod_User} */
const modUser = await container.get('Fl64_Gpt_User_Back_Mod_User$');
/** @type {Fl64_Gpt_User_Back_Mod_Token} */
const modToken = await container.get('Fl64_Gpt_User_Back_Mod_Token$');
/** @type {typeof Fl64_Gpt_User_Shared_Enum_Token_Type} */
const TOKEN_TYPE = await container.get('Fl64_Gpt_User_Shared_Enum_Token_Type.default');

describe('Fl64_Gpt_User_Back_Web_Api_Update_Load', () => {
    describe('#process', () => {
        let USER_ID, PIN, TOKEN, TOKEN_OTHER;
        /** @type {Fl64_Gpt_User_Shared_Dto_User.Dto} */
        let userDb;

        before(async function () {
            this.timeout(60000);
            await dbReset(container);
            const {user} = await dbCreateFkEntities(container);
            USER_ID = user.id;
            await dbConnect(container);

            // Create user
            const dtoUser = modUser.composeEntity();
            dtoUser.email = EMAIL;
            dtoUser.passHash = 'hash';
            dtoUser.passSalt = 'salt';
            dtoUser.userRef = USER_ID;
            userDb = await modUser.create({dto: dtoUser});
            PIN = userDb.pin;

            // Create valid token
            const dtoToken = modToken.composeEntity();
            dtoToken.type = TOKEN_TYPE.PROFILE_EDIT;
            dtoToken.userRef = USER_ID;
            const createdToken = await modToken.create({dto: dtoToken});
            TOKEN = createdToken.code;

            // Create token with different type
            const dtoTokenOther = modToken.composeEntity();
            dtoTokenOther.type = TOKEN_TYPE.EMAIL_VERIFICATION;
            dtoTokenOther.userRef = USER_ID;
            const createdTokenOther = await modToken.create({dto: dtoTokenOther});
            TOKEN_OTHER = createdTokenOther.code;
        });

        after(async () => {
            await dbDisconnect(container);
        });

        it('should return INVALID_TOKEN when token is missing', async () => {
            const req = endpoint.createReq();
            const res = endpoint.createRes();
            await service.process(req, res, null);
            assert.strictEqual(res.resultCode, RESULT_CODE.INVALID_TOKEN);
        });

        it('should return INVALID_TOKEN when token is not found', async () => {
            const req = endpoint.createReq();
            req.token = 'invalid-token';
            const res = endpoint.createRes();
            await service.process(req, res, null);
            assert.strictEqual(res.resultCode, RESULT_CODE.INVALID_TOKEN);
        });

        it('should return INVALID_TOKEN when token type is not PROFILE_EDIT', async () => {
            const req = endpoint.createReq();
            req.token = TOKEN_OTHER;
            const res = endpoint.createRes();
            await service.process(req, res, null);
            assert.strictEqual(res.resultCode, RESULT_CODE.INVALID_TOKEN);
        });

        it('should return SUCCESS and include user data when token is valid', async () => {
            const req = endpoint.createReq();
            req.token = TOKEN;
            const res = endpoint.createRes();
            await service.process(req, res, null);
            assert.strictEqual(res.dateCreated.getTime(), userDb.dateCreated.getTime());
            assert.strictEqual(res.email, userDb.email);
            assert.strictEqual(res.locale, userDb.locale);
            assert.strictEqual(res.pin, userDb.pin);
            assert.strictEqual(res.status, userDb.status);
            assert.strictEqual(res.resultCode, RESULT_CODE.SUCCESS);
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
            assert.strictEqual(endpointInstance.constructor.name, 'Fl64_Gpt_User_Shared_Web_Api_Update_Load');
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
