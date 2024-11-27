import {createContainer} from '@teqfw/test';
import {dbConnect, dbCreateFkEntities, dbDisconnect, dbReset, initConfig} from '../../../../common.mjs';
import assert from 'node:assert';
import {constants as H2} from 'node:http2';

// VARS
const {
    HTTP2_HEADER_AUTHORIZATION,
    HTTP_STATUS_FORBIDDEN,
} = H2;
const TOKEN = process.env.AUTH_TOKEN ?? 'test-token';
const EMAIL = process.env.EMAIL ?? 'user@any.domain.in.tld';

// CONTAINER SETUP
const container = await createContainer();
await initConfig(container);

// ENV SETUP
/** @type {Fl64_Gpt_User_Back_Web_Api_Update_Init} */
const service = await container.get('Fl64_Gpt_User_Back_Web_Api_Update_Init$');
/** @type {Fl64_Gpt_User_Shared_Web_Api_Update_Init} */
const endpoint = await container.get('Fl64_Gpt_User_Shared_Web_Api_Update_Init$');
const RESULT_CODE = endpoint.getResultCodes();

/** @type {Fl64_Gpt_User_Back_Mod_User} */
const modUser = await container.get('Fl64_Gpt_User_Back_Mod_User$');

describe('Fl64_Gpt_User_Back_Web_Api_Update_Init', () => {
    // VARS
    let USER_ID, PIN;

    const context = {
        request: {
            headers: {
                [HTTP2_HEADER_AUTHORIZATION]: 'Bearer ' + TOKEN,
            },
        },
    };

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

    it('should return SUCCESS when the profile update process is initiated successfully with PIN identifier', async () => {
        // test the service
        const req = endpoint.createReq();
        req.pin = PIN;
        const res = endpoint.createRes();
        await service.process(req, res, context);
        assert.strictEqual(res.resultCode, RESULT_CODE.SUCCESS);
    });

    it('should return SUCCESS when the profile update process is initiated successfully with email identifier', async () => {
        // test the service
        const req = endpoint.createReq();
        req.email = EMAIL;
        const res = endpoint.createRes();
        await service.process(req, res, context);
        assert.strictEqual(res.resultCode, RESULT_CODE.SUCCESS);
    });

    it('should handle cases where the provided PIN does not match any user', async () => {
        // test the service
        const req = endpoint.createReq();
        req.pin = PIN + 987398573493875;
        req.email = EMAIL + 'some data in the end';
        const res = endpoint.createRes();
        await service.process(req, res, context);
        assert.strictEqual(res.resultCode, RESULT_CODE.SUCCESS);
    });

    it('should respond with 403 if the request is unauthorized', async () => {
        // test the service
        const req = endpoint.createReq();
        req.email = EMAIL;
        const res = endpoint.createRes();
        const contextWrong = structuredClone(context);
        contextWrong.request.headers[HTTP2_HEADER_AUTHORIZATION] = 'this is wrong bearer';
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

    it('should return SERVER_ERROR if an unexpected error occurs during the process', async () => {
        // mock the model
        const origin = modUser.read.bind(modUser);
        modUser.read = () => { throw new Error('test error');};
        // test the service
        const req = endpoint.createReq();
        req.pin = PIN;
        const res = endpoint.createRes();
        await service.process(req, res, context);
        assert.strictEqual(res.resultCode, RESULT_CODE.SERVER_ERROR);
        // restore the model
        modUser.read = origin;
    });


});
