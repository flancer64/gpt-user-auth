import {container} from '@teqfw/test';
import assert from 'assert';

// GET OBJECT FROM CONTAINER
/** @type {Fl64_Gpt_User_Shared_Dto_OAuth2_Token} */
const domDto = await container.get('Fl64_Gpt_User_Shared_Dto_OAuth2_Token$');

describe('Fl64_Gpt_User_Shared_Dto_OAuth2_Token', () => {
    const expectedProperties = [
        'id',
        'accessToken',
        'refreshToken',
        'clientRef',
        'userRef',
        'dateExpire',
        'scope'
    ];

    it('should create a Domain DTO with only the expected properties', () => {
        const dto = domDto.createDto();
        const dtoKeys = Object.keys(dto).sort();

        // Verify that the DTO has only the expected properties
        assert.deepStrictEqual(
            dtoKeys,
            expectedProperties.sort(),
            'DTO should contain only the expected properties'
        );

        // Check that each property is initially undefined
        expectedProperties.forEach(prop => {
            assert.strictEqual(
                dto[prop],
                undefined,
                `Property "${prop}" should initially be undefined`
            );
        });
    });
});
