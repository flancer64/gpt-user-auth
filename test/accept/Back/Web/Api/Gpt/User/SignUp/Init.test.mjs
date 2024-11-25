import {createContainer} from '@teqfw/test';
import {dbConnect, dbCreateFkEntities, dbDisconnect, dbReset, initConfig} from '../../../../../../common.mjs';
import assert from 'assert';

// SETUP CONTAINER
const container = await createContainer();
await initConfig(container);

describe('Fl64_Gpt_User_Back_Web_Api_SignUp_Init', () => {
    const EMAIL = 'alex@flancer64.com';
    const PASS_PHRASE = 'my little pass word';

    // DI Proxy
    /** @type {Fl64_Gpt_User_Back_Web_Api_SignUp_Init} */
    let service;
    /** @type {Fl64_Gpt_User_Shared_Web_Api_SignUp_Init} */
    let endpoint;
    /** @type {typeof Fl64_Gpt_User_Shared_Web_Api_SignUp_Init.RESULT_CODE} */
    let RESULT_CODE;
    let USER_ID;

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
                } else if (originalId.moduleName === 'Fl64_Gpt_User_Back_Email_SignUp_Init') {
                    obj.execute = async () => true;
                }
                return obj;
            }
        });
        await initConfig(container, true);
        await dbReset(container);
        const {user} = await dbCreateFkEntities(container);
        USER_ID = user.id;
        /** @type {Fl64_Gpt_User_Back_Mod_Auth} */
        const modAuth = await container.get('Fl64_Gpt_User_Back_Mod_Auth$');
        modAuth.hasBearerInRequest = () => true;
        await dbConnect(container);
        service = await container.get('Fl64_Gpt_User_Back_Web_Api_SignUp_Init$');
        endpoint = await container.get('Fl64_Gpt_User_Shared_Web_Api_SignUp_Init$');
        RESULT_CODE = endpoint.getResultCodes();
    });

    after(async () => {
        await dbDisconnect(container);
    });


    it('should successfully initiate registration for a new user', async () => {
        const req = endpoint.createReq();
        req.email = EMAIL;
        req.passPhrase = PASS_PHRASE;
        req.isConsent = true;
        req.locale = 'lv-LV';
        const res = endpoint.createRes();
        await service.process(req, res);

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
        await service.process(req, res);

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
        await service.process(req, res);

        // Check if entity and item are correctly composed
        assert.strictEqual(res.resultCode, RESULT_CODE.EMAIL_ALREADY_REGISTERED, 'Expected resultCode to be EMAIL_ALREADY_REGISTERED.');
        assert.ok(res.instructions, 'Expected instructions to be provided in the response.');
    });

});
