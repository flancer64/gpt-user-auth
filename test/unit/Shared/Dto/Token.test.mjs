import {container} from '@teqfw/test';
import assert from 'assert';

// GET OBJECT FROM CONTAINER
/** @type {Fl64_Gpt_User_Shared_Dto_Token} */
const domDto = await container.get('Fl64_Gpt_User_Shared_Dto_Token$');

describe('Fl64_Gpt_User_Shared_Dto_Token', () => {
    const expectedProperties = [
        'code',
        'dateCreated',
        'type',
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
