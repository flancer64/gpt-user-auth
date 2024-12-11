import {createContainer} from '@teqfw/test';
import {dbConnect, dbCreateFkEntities, dbDisconnect, dbReset, initConfig} from '../../../../common.mjs';
import assert from 'node:assert';
import {constants as H2} from 'node:http2';

// Constants
const {
    HTTP2_HEADER_AUTHORIZATION,
    HTTP_STATUS_FORBIDDEN,
} = H2;


const BEARER = process.env.AUTH_TOKEN ?? 'test-token';
const EMAIL = process.env.EMAIL ?? 'user@any.domain.in.tld';
const OAI_USER_ID = process.env.OAI_USER_ID ?? 'some-user-id';

// Container setup
const container = await createContainer();
await initConfig(container);

// Service and endpoint instances
/** @type {Fl64_Gpt_User_Back_Web_Api_Update_Init} */
const service = await container.get('Fl64_Gpt_User_Back_Web_Api_Update_Init$');
/** @type {Fl64_Gpt_User_Shared_Web_Api_Update_Init} */
const endpoint = await container.get('Fl64_Gpt_User_Shared_Web_Api_Update_Init$');
const RESULT_CODE = endpoint.getResultCodes();

/** @type {Fl64_Gpt_User_Back_Mod_User} */
const modUser = await container.get('Fl64_Gpt_User_Back_Mod_User$');
/** @type {Fl64_Gpt_User_Back_Defaults} */
const DEF = await container.get('Fl64_Gpt_User_Back_Defaults$');

describe('Fl64_Gpt_User_Back_Web_Api_Update_Init', () => {
    // VARS
    let USER_ID, PIN;

    const context = createContext();

    // FUNCS
    function createContext() {
        return {
            request: {
                headers: {
                    [HTTP2_HEADER_AUTHORIZATION]: 'Bearer ' + BEARER,
                    [DEF.HTTP_HEAD_OPENAI_EPHEMERAL_USER_ID]: OAI_USER_ID
                },
            },
            response: {
                headersSent: false,
                writeHead() {},
                write() {},
                end() {},
            }
        };
    }

    // MAIN
    before(async function () {
        this.timeout(60000);
        await dbReset(container);
        const {user} = await dbCreateFkEntities(container);
        USER_ID = user.id;
        await dbConnect(container);
        const dto = modUser.composeEntity();
        dto.email = EMAIL;
        dto.passHash = 'hash';
        dto.passSalt = 'salt';
        dto.userRef = USER_ID;
        const created = await modUser.create({dto});
        PIN = created.pin;
    });

    after(async () => {
        await dbDisconnect(container);
    });

    it('should return SUCCESS when the profile update process is initiated with a valid email', async () => {
        const req = endpoint.createReq();
        req.email = EMAIL;
        const res = endpoint.createRes();
        await service.process(req, res, context);
        assert.strictEqual(res.resultCode, RESULT_CODE.SUCCESS);
    });

    it('should return SUCCESS when the profile update process is initiated with a valid PIN', async () => {
        const req = endpoint.createReq();
        req.pin = PIN;
        const res = endpoint.createRes();
        await service.process(req, res, context);
        assert.strictEqual(res.resultCode, RESULT_CODE.SUCCESS);
    });

    it('should return SUCCESS when the profile update process is initiated with an invalid email and valid PIN', async () => {
        const req = endpoint.createReq();
        req.email = 'user@does.not.exist';
        req.pin = PIN;
        const res = endpoint.createRes();
        await service.process(req, res, context);
        assert.strictEqual(res.resultCode, RESULT_CODE.SUCCESS);
    });

    it('should return SUCCESS when the provided PIN or email does not match any user', async () => {
        const req = endpoint.createReq();
        req.pin = PIN + 98875;
        req.email = EMAIL + 'invalid-suffix';
        const res = endpoint.createRes();
        await service.process(req, res, context);
        assert.strictEqual(res.resultCode, RESULT_CODE.SUCCESS);
    });

    it('should respond with 403 if the authorization header is invalid', async () => {
        const req = endpoint.createReq();
        req.email = EMAIL;
        const res = endpoint.createRes();
        const contextWrong = createContext();
        contextWrong.request.headers[HTTP2_HEADER_AUTHORIZATION] = 'invalid-bearer';
        let status403;
        contextWrong.response = {
            headersSent: false,
            writeHead(status) {
                status403 = status;
            },
            write() {},
            end() {},
        };
        await service.process(req, res, contextWrong);
        assert.strictEqual(res.resultCode, undefined);
        assert.strictEqual(status403, HTTP_STATUS_FORBIDDEN);
    });

    it('should return SERVER_ERROR if an unexpected error occurs', async () => {
        const originalRead = modUser.read.bind(modUser);
        modUser.read = () => { throw new Error('test error'); };

        const req = endpoint.createReq();
        req.pin = PIN;
        const res = endpoint.createRes();
        await service.process(req, res, context);

        assert.strictEqual(res.resultCode, RESULT_CODE.SERVER_ERROR);

        modUser.read = originalRead;
    });
});
