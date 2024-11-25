import {container} from '@teqfw/test';
import assert from 'assert';

// GET OBJECT FROM CONTAINER
/** @type {Fl64_Gpt_User_Shared_Web_Api_SignUp_Init} */
const endpoint = await container.get('Fl64_Gpt_User_Shared_Web_Api_SignUp_Init$');

describe('Fl64_Gpt_User_Shared_Web_Api_SignUp_Init', () => {
    // Expected properties for the Request DTO
    const expectedRequestProperties = [
        'email',
        'isConsent',
        'locale',
        'passPhrase',
    ];

    // Expected properties for the Response DTO
    const expectedResponseProperties = [
        'resultCode',
        'pin',
        'instructions',
    ];

    // Expected ResultCode values
    const expectedResultCodes = [
        'CONSENT_REQUIRED',
        'EMAIL_ALREADY_REGISTERED',
        'SERVER_ERROR',
        'SUCCESS',
    ];

    it('should create a Request DTO with only the expected properties', () => {
        const reqDto = endpoint.createReq();
        const reqDtoKeys = Object.keys(reqDto).sort();

        assert.deepStrictEqual(
            reqDtoKeys,
            expectedRequestProperties.sort(),
            'Request DTO should contain only the expected properties'
        );

        expectedRequestProperties.forEach(prop =>
            assert.strictEqual(
                reqDto[prop],
                undefined,
                `Property "${prop}" in Request DTO should initially be undefined`
            )
        );
    });

    it('should create a Response DTO with only the expected properties', () => {
        const resDto = endpoint.createRes();
        const resDtoKeys = Object.keys(resDto).sort();

        assert.deepStrictEqual(
            resDtoKeys,
            expectedResponseProperties.sort(),
            'Response DTO should contain only the expected properties'
        );

        expectedResponseProperties.forEach(prop =>
            assert.strictEqual(
                resDto[prop],
                undefined,
                `Property "${prop}" in Response DTO should initially be undefined`
            )
        );
    });

    it('should contain only the expected values in ResultCode', async () => {
        /** @type {typeof Fl64_Gpt_User_Shared_Web_Api_SignUp_Init.RESULT_CODE} */
        const CODE = endpoint.getResultCodes();
        const resultCodeKeys = Object.keys(CODE).sort((a, b) => a.localeCompare(b));
        const sortedExpected = expectedResultCodes.sort((a, b) => a.localeCompare(b));

        assert.deepStrictEqual(
            resultCodeKeys,
            sortedExpected,
            'ResultCode should contain only the expected values'
        );
    });
});
