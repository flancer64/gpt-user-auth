import {container} from '@teqfw/test';
import assert from 'assert';

// GET OBJECTS FROM CONTAINER
/** @type {Fl64_Gpt_User_Shared_Dto_OAuth2_Token} */
const domDto = await container.get('Fl64_Gpt_User_Shared_Dto_OAuth2_Token$');
/** @type {Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Token} */
const rdbDto = await container.get('Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Token$');
/** @type {Fl64_Gpt_User_Back_Convert_OAuth2_Token} */
const converter = await container.get('Fl64_Gpt_User_Back_Convert_OAuth2_Token$');

describe('Fl64_Gpt_User_Back_Convert_OAuth2_Token', () => {
    const sampleRdbDto = rdbDto.createDto();
    sampleRdbDto.access_token = 'abc123';
    sampleRdbDto.client_ref = 1001;
    sampleRdbDto.date_expire = new Date('2024-01-01T12:00:00Z');
    sampleRdbDto.id = 1;
    sampleRdbDto.refresh_token = 'refresh123';
    sampleRdbDto.scope = 'read,write';
    sampleRdbDto.user_ref = 2002;

    const sampleDomDto = domDto.createDto();
    sampleDomDto.accessToken = 'abc123';
    sampleDomDto.clientRef = 1001;
    sampleDomDto.dateExpire = new Date('2024-01-01T12:00:00Z');
    sampleDomDto.id = 1;
    sampleDomDto.refreshToken = 'refresh123';
    sampleDomDto.scope = 'read,write';
    sampleDomDto.userRef = 2002;

    it('should convert RDB DTO to Domain DTO correctly', () => {
        const result = converter.db2dom({dbToken: sampleRdbDto});
        assert.deepStrictEqual(result, sampleDomDto, 'Converted Domain DTO should match the sample Domain DTO');
    });

    it('should convert Domain DTO to RDB DTO correctly', () => {
        const {dbToken: result} = converter.dom2db({token: sampleDomDto});
        assert.deepStrictEqual(result, sampleRdbDto, 'Converted RDB DTO should match the sample RDB DTO');
    });
});
