import {container} from '@teqfw/test';
import assert from 'assert';

// GET OBJECTS FROM CONTAINER
/** @type {Fl64_Gpt_User_Back_Store_RDb_Schema_Token} */
const rdbDto = await container.get('Fl64_Gpt_User_Back_Store_RDb_Schema_Token$');
/** @type {Fl64_Gpt_User_Back_Defaults} */
const DEF = await container.get('Fl64_Gpt_User_Back_Defaults$');

describe('Fl64_Gpt_User_Back_Store_RDb_Schema_Token', () => {
    const ATTR = rdbDto.getAttributes();
    const expectedProperties = [
        'code',
        'date_created',
        'type',
        'user_ref',
    ];

    it('should create an RDB DTO with only the expected properties', () => {
        const dto = rdbDto.createDto();
        const dtoKeys = Object.keys(dto).sort();

        // Verify that the DTO has only the expected properties
        assert.deepStrictEqual(dtoKeys, expectedProperties.sort(), 'DTO should contain only the expected properties');

        // Check that each property is initially undefined
        expectedProperties.forEach(prop => {
            assert.strictEqual(dto[prop], undefined, `Property ${prop} should initially be undefined`);
        });
    });

    it('ATTR should contain only the expected properties', () => {
        const attrKeys = Object.keys(ATTR).sort();
        const upperCaseExpectedProperties = expectedProperties.map(p => p.toUpperCase()).sort();

        // Check that ATTR has the expected properties in uppercase
        assert.deepStrictEqual(attrKeys, upperCaseExpectedProperties, 'ATTR should contain only the expected properties in uppercase format');

        // Verify that each uppercase property in ATTR maps correctly to its original property name
        expectedProperties.forEach(prop => {
            assert.strictEqual(ATTR[prop.toUpperCase()], prop, `ATTR.${prop.toUpperCase()} should map to ${prop}`);
        });
    });

    it('should have the correct ENTITY name and primary key', async () => {
        // Verify the entity name
        assert.equal(rdbDto.getEntityName(), `${DEF.NAME}/fl64/gpt/token`, 'Entity name should match the expected path');

        // Check that the primary key is set to USER_REF
        assert.deepStrictEqual(rdbDto.getPrimaryKey(), [ATTR.CODE], 'Primary key should be set to USER_REF');
    });
});
