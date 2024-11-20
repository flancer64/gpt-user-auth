import {container} from '@teqfw/test';
import assert from 'assert';

// GET OBJECTS FROM CONTAINER
/** @type {Fl64_Gpt_User_Shared_Dto_Token} */
const domDto = await container.get('Fl64_Gpt_User_Shared_Dto_Token$');
/** @type {Fl64_Gpt_User_Back_Store_RDb_Schema_Token} */
const rdbDto = await container.get('Fl64_Gpt_User_Back_Store_RDb_Schema_Token$');
/** @type {Fl64_Gpt_User_Back_Convert_Token} */
const converter = await container.get('Fl64_Gpt_User_Back_Convert_Token$');

describe('Fl64_Gpt_User_Back_Convert_Token', () => {
    // Sample RDB DTO with snake_case naming convention for persistence storage
    const sampleRdbDto = rdbDto.createDto({
        code: '123456',
        date_created: new Date('2024-01-01T12:00:00Z'),
        type: 'EMAIL_VERIFICATION',
        user_ref: 42
    });

    // Sample Domain DTO with camelCase naming convention for business logic
    const sampleDomDto = domDto.createDto({
        code: '123456',
        dateCreated: new Date('2024-01-01T12:00:00Z'),
        type: 'EMAIL_VERIFICATION',
        userRef: 42
    });

    it('should convert RDB DTO to Domain DTO correctly', () => {
        const convertedDomDto = converter.db2dom({dbToken: sampleRdbDto});
        assert.deepStrictEqual(convertedDomDto, sampleDomDto, 'Converted Domain DTO should match the sample Domain DTO');
    });

    it('should convert Domain DTO to RDB DTO correctly', () => {
        const {dbToken: convertedRdbDto} = converter.dom2db({token: sampleDomDto});
        assert.deepStrictEqual(convertedRdbDto, sampleRdbDto, 'Converted RDB DTO should match the sample RDB DTO');
    });
});
