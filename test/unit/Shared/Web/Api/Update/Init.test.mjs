import {container} from '@teqfw/test';
import assert from 'assert';

// GET OBJECTS FROM CONTAINER
/** @type {Fl64_Gpt_User_Shared_Web_Api_Update_Init} */
const endpoint = await container.get('Fl64_Gpt_User_Shared_Web_Api_Update_Init$');
const RESULT_CODE = endpoint.getResultCodes();

describe('Fl64_Gpt_User_Shared_Web_Api_Update_Init', () => {
    // Expected properties for the Request DTO
    const expectedRequestProperties = [
        'email',
        'pin',
    ];

    // Expected properties for the Response DTO
    const expectedResponseProperties = [
        'instructions',
        'resultCode',
    ];

    // Expected ResultCode values
    const expectedResultCodes = [
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
