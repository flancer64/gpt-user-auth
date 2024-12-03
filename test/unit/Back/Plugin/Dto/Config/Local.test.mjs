import {container} from '@teqfw/test';
import assert from 'assert';

// GET OBJECT FROM CONTAINER
/** @type {Fl64_Gpt_User_Back_Plugin_Dto_Config_Local} */
const pluginConfigDto = await container.get('Fl64_Gpt_User_Back_Plugin_Dto_Config_Local$');

describe('Fl64_Gpt_User_Back_Plugin_Dto_Config_Local', () => {
    const expectedProperties = [
        'authBearerTokens',
    ];

    it('should create a Local Configuration DTO with only the expected properties', () => {
        const dto = new pluginConfigDto.createDto();
        const dtoKeys = Object.keys(dto).sort();

        assert.deepStrictEqual(
            dtoKeys,
            expectedProperties.sort(),
            'DTO should contain only the expected properties'
        );

        expectedProperties.forEach(prop =>
            assert.deepStrictEqual(
                dto[prop],
                [],
                `Property "${prop}" should initially be empty array`
            )
        );
    });
});
