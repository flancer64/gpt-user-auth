import {container} from '@teqfw/test';
import assert from 'assert';

// GET OBJECT FROM CONTAINER
/** @type {Fl64_Gpt_User_Shared_Dto_OAuth2_Code} */
const domDto = await container.get('Fl64_Gpt_User_Shared_Dto_OAuth2_Code$');

describe('Fl64_Gpt_User_Shared_Dto_OAuth2_Code', () => {
    const expectedProperties = [
        'clientRef',
        'code',
        'dateExpired',
        'id',
        'redirectUri',
        'scope',
        'userRef',
    ];

    it('should create a Domain DTO with only the expected properties', () => {
        const dto = new domDto.createDto();
        const dtoKeys = Object.keys(dto).sort();

        assert.deepStrictEqual(
            dtoKeys,
            expectedProperties.sort(),
            'DTO should contain only the expected properties'
        );

        expectedProperties.forEach(prop =>
            assert.strictEqual(
                dto[prop],
                undefined,
                `Property "${prop}" should initially be undefined`
            )
        );
    });

});
