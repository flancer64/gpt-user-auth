import {container} from '@teqfw/test';
import assert from 'assert';

// GET OBJECTS FROM CONTAINER
/** @type {Fl64_Gpt_User_Shared_Dto_Openai_User} */
const domDto = await container.get('Fl64_Gpt_User_Shared_Dto_Openai_User$');
/** @type {Fl64_Gpt_User_Back_Store_RDb_Schema_Openai_User} */
const rdbDto = await container.get('Fl64_Gpt_User_Back_Store_RDb_Schema_Openai_User$');
/** @type {Fl64_Gpt_User_Back_Convert_Openai_User} */
const converter = await container.get('Fl64_Gpt_User_Back_Convert_Openai_User$');

describe('Fl64_Gpt_User_Back_Convert_Openai_User', () => {
    const sampleRdbDto = rdbDto.createDto({
        code: 'auth_code_123',
        date_created: new Date('2023-01-01T00:00:00Z'),
        date_last: new Date('2023-01-02T00:00:00Z'),
        user_ref: 42
    });

    const sampleDomDto = domDto.createDto({
        code: 'auth_code_123',
        dateCreated: new Date('2023-01-01T00:00:00Z'),
        dateLast: new Date('2023-01-02T00:00:00Z'),
        userRef: 42
    });

    it('should convert RDB DTO to Domain DTO correctly', () => {
        const domDto = converter.db2dom({dbUser: sampleRdbDto});
        assert.deepStrictEqual(domDto, sampleDomDto, 'Converted Domain DTO should match the sample Domain DTO');
    });

    it('should convert Domain DTO to RDB DTO correctly', () => {
        const {dbUser: rdbDto} = converter.dom2db({user: sampleDomDto});
        assert.deepStrictEqual(rdbDto, sampleRdbDto, 'Converted RDB DTO should match the sample RDB DTO');
    });
});
