import {createContainer} from '@teqfw/test';
import {dbConnect, dbCreateFkEntities, dbDisconnect, dbReset, initConfig} from '../../../../../../common.mjs';
import assert from 'assert';

// SETUP CONTAINER
const container = await createContainer();
await initConfig(container);


// SETUP ENVIRONMENT
/** @type {Fl64_Gpt_User_Back_Mod_User} */
const modUser = await container.get('Fl64_Gpt_User_Back_Mod_User$');
/** @type {Fl64_Gpt_User_Back_Mod_Token} */
const modToken = await container.get('Fl64_Gpt_User_Back_Mod_Token$');
/** @type {typeof Fl64_Gpt_User_Shared_Enum_User_Status} */
const STATUS = await container.get('Fl64_Gpt_User_Shared_Enum_User_Status.default');
/** @type {typeof Fl64_Gpt_User_Shared_Enum_Token_Type} */
const TYPE = await container.get('Fl64_Gpt_User_Shared_Enum_Token_Type.default');


// DECLARE THE TEST DATA
let PIN;
let TOKEN_CODE;
let USER_ID;

const EMAIL = 'alex@flancer64.com';
const LOCALE = 'es-ES';

// Test Suite for User Model
describe('Fl64_Gpt_User_Back_Web_Api_SignUp_Verify', () => {
    /** @type {Fl64_Gpt_User_Back_Web_Api_SignUp_Verify} */
    let service;
    /** @type {Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify} */
    let endpoint;
    /** @type {typeof Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify.RESULT_CODE} */
    let RESULT_CODE;

    before(async function () {
        this.timeout(60000); // for debug
        const post = container.getPostProcessor();
        post.addChunk({
            modify(obj, originalId) {
                if (originalId.moduleName === 'Fl64_Gpt_User_Back_Mod_User') {
                    const originalModUserCreate = obj.create.bind(obj);
                    // Override `create` to include the `modUser` call first
                    obj.create = async function ({trx, dto}) {
                        if (!dto?.userRef) dto.userRef = USER_ID;
                        return await originalModUserCreate({trx, dto});
                    };
                }
                return obj;
            }
        });
        await initConfig(container, true);
        await dbReset(container);
        const {user} = await dbCreateFkEntities(container);
        USER_ID = user.id;
        await dbConnect(container);

        /** @type {TeqFw_Db_Back_RDb_Connect} */
        const conn = await container.get('TeqFw_Db_Back_RDb_IConnect$');
        const trx = await conn.startTransaction();
        // create a user
        const dtoUser = modUser.composeEntity();
        dtoUser.email = EMAIL;
        dtoUser.locale = 'es-ES';
        dtoUser.passHash = 'hash';
        dtoUser.passSalt = 'salt';
        dtoUser.userRef = USER_ID;
        const createdUser = await modUser.create({trx, dto: dtoUser});
        PIN = createdUser.pin;

        // create a token
        const dtoToken = modToken.composeEntity();
        dtoToken.type = TYPE.EMAIL_VERIFICATION;
        dtoToken.userRef = USER_ID;
        const createdToken = await modToken.create({trx, dto: dtoToken});
        TOKEN_CODE = createdToken.code;
        await trx.commit();

        service = await container.get('Fl64_Gpt_User_Back_Web_Api_SignUp_Verify$');
        endpoint = await container.get('Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify$');
        RESULT_CODE = endpoint.getResultCodes();
    });

    after(async () => {
        await dbDisconnect(container);
    });

    it('should successfully load user profile for a valid token', async () => {
        const req = endpoint.createReq();
        req.token = TOKEN_CODE;
        const res = endpoint.createRes();
        await service.process(req, res);

        assert.strictEqual(res.email, EMAIL, '...');
        assert.strictEqual(res.locale, LOCALE, '...');
        assert.strictEqual(res.pin, PIN, '...');
        assert.strictEqual(res.resultCode, RESULT_CODE.SUCCESS, '...');
        assert.strictEqual(res.status, STATUS.ACTIVE, '...');
    });
    it('should not load user profile for a second usage of the token', async () => {
        const req = endpoint.createReq();
        req.token = TOKEN_CODE;
        const res = endpoint.createRes();
        await service.process(req, res);

        assert.strictEqual(res.resultCode, RESULT_CODE.INVALID_TOKEN, '....');
    });

});
