import assert from 'assert';
import {config as cfgTest, container, dbConnect, RDBMS} from '@teqfw/test';
import {join} from 'path';

// SETUP ENVIRONMENT
/** @type {TeqFw_Core_Back_Config} */
const config = await container.get('TeqFw_Core_Back_Config$');
/** @type {TeqFw_Db_Back_RDb_Connect} */
const conn = await container.get('TeqFw_Db_Back_RDb_IConnect$');
/** @type {Fl64_Gpt_User_Back_Web_Api_SignUp_Init} */
const service = await container.get('Fl64_Gpt_User_Back_Web_Api_SignUp_Init$');
/** @type {Fl64_Gpt_User_Shared_Web_Api_SignUp_Init} */
const endpoint = await container.get('Fl64_Gpt_User_Shared_Web_Api_SignUp_Init$');

const EMAIL = 'alex@flancer64.com';
const PASS_PHRASE = 'my little pass word';
const RESULT_CODE = endpoint.getResultCodes();

// MOCKS
/** @type {Fl64_Gpt_User_Back_Mod_Auth} */
const modAuth = await container.get('Fl64_Gpt_User_Back_Mod_Auth$');
modAuth.hasBearerInRequest = () => true;
const context = {
    request: {},
};

before(async () => {
    // Initialize environment configuration
    config.init(cfgTest.pathToRoot, '0.0.0');

    // Set up console transport for the logger
    const base = await container.get('TeqFw_Core_Shared_Logger_Base$');
    const transport = await container.get('TeqFw_Core_Shared_Api_Logger_Transport$');
    base.setTransport(transport);

    // Framework-wide RDB connection from DI
    await dbConnect(RDBMS.SQLITE_BETTER, conn);

    // Initialize database structure
    /** @type {{action: TeqFw_Db_Back_Cli_Init.action}} */
    const {action} = await container.get('TeqFw_Db_Back_Cli_Init$');
    const testDems = {
        test: join(config.getPathToRoot(), 'test', 'data'),
    };
    await action({testDems});
});

after(async () => {
    await conn.disconnect();
});

// Test Suite for User Model
describe('Fl64_Gpt_User_Back_Web_Api_SignUp_Init', () => {

    it('should successfully initiate registration for a new user', async () => {
        const req = endpoint.createReq();
        req.email = EMAIL;
        req.passPhrase = PASS_PHRASE;
        req.isConsent = true;
        req.locale = 'lv-LV';
        const res = endpoint.createRes();
        await service.process(req, res, context);

        assert.strictEqual(res.resultCode, RESULT_CODE.SUCCESS, 'Expected resultCode to be SUCCESS for successful registration.');
        assert.ok(res.instructions, 'Expected instructions to be provided in the response.');
        assert.ok(res.pin, 'Expected a valid PIN code to be generated.');
    });

    it('should not allow registration without consent', async () => {
        const req = endpoint.createReq();
        req.email = EMAIL;
        req.passPhrase = PASS_PHRASE;
        req.locale = 'lv-LV';
        const res = endpoint.createRes();
        await service.process(req, res, context);

        // Check if entity and item are correctly composed
        assert.strictEqual(res.resultCode, RESULT_CODE.CONSENT_REQUIRED, 'Expected resultCode to be CONSENT_REQUIRED.');
        assert.ok(res.instructions, 'Expected instructions to be provided in the response.');
    });

    it('should not allow registration for an already registered email', async () => {
        const req = endpoint.createReq();
        req.email = EMAIL;
        req.passPhrase = PASS_PHRASE;
        req.isConsent = true;
        req.locale = 'lv-LV';
        const res = endpoint.createRes();
        await service.process(req, res, context);

        // Check if entity and item are correctly composed
        assert.strictEqual(res.resultCode, RESULT_CODE.EMAIL_ALREADY_REGISTERED, 'Expected resultCode to be EMAIL_ALREADY_REGISTERED.');
        assert.ok(res.instructions, 'Expected instructions to be provided in the response.');
    });

});
