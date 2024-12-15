import {container} from '@teqfw/test';
import assert from 'assert';

// GET OBJECTS FROM CONTAINER
/** @type {Fl64_Gpt_User_Shared_Dto_OAuth2_Code} */
const domDto = await container.get('Fl64_Gpt_User_Shared_Dto_OAuth2_Code$');
/** @type {Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Code} */
const rdbDto = await container.get('Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Code$');
/** @type {Fl64_Gpt_User_Back_Convert_OAuth2_Code} */
const converter = await container.get('Fl64_Gpt_User_Back_Convert_OAuth2_Code$');

describe('Fl64_Gpt_User_Back_Convert_OAuth2_Code', () => {
    const sampleRdbDto = rdbDto.createDto();
    sampleRdbDto.client_ref = 1001;
    sampleRdbDto.code = 'sample-code';
    sampleRdbDto.date_expired = new Date('2023-01-01T00:00:00Z');
    sampleRdbDto.id = 1;
    sampleRdbDto.redirect_uri = 'https://example.com/callback';
    sampleRdbDto.scope = 'read write';
    sampleRdbDto.user_ref = 5005;

    const sampleDomDto = domDto.createDto();
    sampleDomDto.clientRef = 1001;
    sampleDomDto.code = 'sample-code';
    sampleDomDto.dateExpired = new Date('2023-01-01T00:00:00Z');
    sampleDomDto.id = 1;
    sampleDomDto.redirectUri = 'https://example.com/callback';
    sampleDomDto.scope = 'read write';
    sampleDomDto.userRef = 5005;

    it('should convert RDB DTO to Domain DTO correctly', () => {
        const domResult = converter.db2dom({dbCode: sampleRdbDto});
        assert.deepStrictEqual(domResult, sampleDomDto, 'Converted Domain DTO should match the sample Domain DTO');
    });

    it('should convert Domain DTO to RDB DTO correctly', () => {
        const {dbCode: rdbResult} = converter.dom2db({code: sampleDomDto});
        assert.deepStrictEqual(rdbResult, sampleRdbDto, 'Converted RDB DTO should match the sample RDB DTO');
    });
});
