import {createContainer} from '@teqfw/test';
import {dbConnect, dbDisconnect, initConfig} from '../../../../common.mjs';
import assert from 'node:assert';

// CONTAINER SETUP
const container = await createContainer();
await initConfig(container);

// ENV SETUP
/** @type {Fl64_Gpt_User_Back_Web_Api_Test_Email} */
const service = await container.get('Fl64_Gpt_User_Back_Web_Api_Test_Email$');
/** @type {Fl64_Gpt_User_Shared_Web_Api_Test_Email} */
const endpoint = await container.get('Fl64_Gpt_User_Shared_Web_Api_Test_Email$');
const RESULT_CODE = endpoint.getResultCodes();
describe('Fl64_Gpt_User_Back_Web_Api_Test_Email - Acceptance Tests', () => {
    // VARS

    before(async () => {
        await dbConnect(container);
    });

    after(async () => {
        await dbDisconnect(container);
    });

    it('should respond with SUCCESS when email is sent successfully', async () => {
        // ENV SETUP
        /** @type {Fl64_Gpt_User_Back_Mod_Auth} */
        const modAuth = await container.get('Fl64_Gpt_User_Back_Mod_Auth$');
        modAuth.isValidRequest = async () => true;
        modAuth.loadUser = () => ({id: 12});
        /** @type {TeqFw_Email_Back_Act_Send} */
        const actSend = await container.get('TeqFw_Email_Back_Act_Send$');
        actSend.act = () => ({success: true});

        // test the service
        const req = endpoint.createReq();
        const res = endpoint.createRes();
        await service.process(req, res, context);
        assert.strictEqual(res.resultCode, RESULT_CODE.SUCCESS);
    });

    it('should respond with UNAUTHENTICATED when user authentication fails', async () => {
        // ENV SETUP
        /** @type {Fl64_Gpt_User_Back_Mod_Auth} */
        const modAuth = await container.get('Fl64_Gpt_User_Back_Mod_Auth$');
        modAuth.isValidRequest = async () => true;
        modAuth.loadUser = () => null;

        // test the service
        const req = endpoint.createReq();
        const res = endpoint.createRes();
        await service.process(req, res, context);
        assert.strictEqual(res.resultCode, RESULT_CODE.UNAUTHENTICATED);
    });

    it('should respond with SERVICE_ERROR when email sending fails', async () => {
        // ENV SETUP
        /** @type {Fl64_Gpt_User_Back_Mod_Auth} */
        const modAuth = await container.get('Fl64_Gpt_User_Back_Mod_Auth$');
        modAuth.isValidRequest = async () => true;
        modAuth.loadUser = () => ({id: 12});
        /** @type {TeqFw_Email_Back_Act_Send} */
        const actSend = await container.get('TeqFw_Email_Back_Act_Send$');
        actSend.act = () => ({success: false});

        // test the service
        const req = endpoint.createReq();
        const res = endpoint.createRes();
        await service.process(req, res, context);
        assert.strictEqual(res.resultCode, RESULT_CODE.SERVICE_ERROR);
    });

    it('should handle unexpected errors gracefully', async () => {
        // Test unexpected error handling
    });

});
