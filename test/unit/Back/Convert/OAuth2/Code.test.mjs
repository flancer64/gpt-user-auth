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
    const sampleRdbDto = rdbDto.createDto({
        id: 1,
        code: 'sample-code',
        client_id: 1001,
        user_id: 5005,
        expires_at: new Date('2023-01-01T00:00:00Z'),
        redirect_uri: 'https://example.com/callback',
        scope: 'read write',
    });

    const sampleDomDto = domDto.createDto({
        id: 1,
        code: 'sample-code',
        clientId: 1001,
        userId: 5005,
        expiresAt: new Date('2023-01-01T00:00:00Z'),
        redirectUri: 'https://example.com/callback',
        scope: 'read write',
    });

    it('should convert RDB DTO to Domain DTO correctly', () => {
        const domResult = converter.db2dom({dbCode: sampleRdbDto});
        assert.deepStrictEqual(domResult, sampleDomDto, 'Converted Domain DTO should match the sample Domain DTO');
    });

    it('should convert Domain DTO to RDB DTO correctly', () => {
        const {dbCode: rdbResult} = converter.dom2db({code: sampleDomDto});
        assert.deepStrictEqual(rdbResult, sampleRdbDto, 'Converted RDB DTO should match the sample RDB DTO');
    });
});
