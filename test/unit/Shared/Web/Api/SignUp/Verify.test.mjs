import {container} from '@teqfw/test';
import assert from 'assert';

// GET OBJECTS FROM CONTAINER
/** @type {Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify} */
const endpoint = await container.get('Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify$');
const RESULT_CODE = endpoint.getResultCodes();

describe('Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify', () => {
    // Expected properties for the Request DTO
    const expectedRequestProperties = [
        'token',
    ];

    // Expected properties for the Response DTO
    const expectedResponseProperties = [
        'dateCreated',
        'email',
        'instructions',
        'locale',
        'pin',
        'resultCode',
        'status',
    ];

    // Expected ResultCode values
    const expectedResultCodes = [
        'INVALID_TOKEN',
        'SUCCESS',
        'USER_NOT_FOUND'
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

    it('should contain only the expected values in ResultCode', () => {
        const resultCodeKeys = Object.keys(RESULT_CODE).sort();

        assert.deepStrictEqual(
            resultCodeKeys,
            expectedResultCodes.sort(),
            'ResultCode should contain only the expected values'
        );

        expectedResultCodes.forEach(code =>
            assert.strictEqual(
                RESULT_CODE[code],
                code,
                `ResultCode should contain the key "${code}" with value "${code}"`
            )
        );
    });
});
