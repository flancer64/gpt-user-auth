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
    const sampleRdbDto = rdbDto.createDto({
        id: 1,
        access_token: 'abc123',
        refresh_token: 'refresh123',
        client_ref: 1001,
        user_ref: 2002,
        date_expire: new Date('2024-01-01T12:00:00Z'),
        scope: 'read,write'
    });

    const sampleDomDto = domDto.createDto({
        id: 1,
        accessToken: 'abc123',
        refreshToken: 'refresh123',
        clientRef: 1001,
        userRef: 2002,
        dateExpire: new Date('2024-01-01T12:00:00Z'),
        scope: 'read,write'
    });

    it('should convert RDB DTO to Domain DTO correctly', () => {
        const result = converter.db2dom({dbToken: sampleRdbDto});
        assert.deepStrictEqual(result, sampleDomDto, 'Converted Domain DTO should match the sample Domain DTO');
    });

    it('should convert Domain DTO to RDB DTO correctly', () => {
        const {dbToken: result} = converter.dom2db({token: sampleDomDto});
        assert.deepStrictEqual(result, sampleRdbDto, 'Converted RDB DTO should match the sample RDB DTO');
    });
});
