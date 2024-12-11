import { container } from '@teqfw/test';
import assert from 'assert';

// GET OBJECTS FROM CONTAINER
/** @type {Fl64_Gpt_User_Shared_Dto_OAuth2_Client} */
const domDto = await container.get('Fl64_Gpt_User_Shared_Dto_OAuth2_Client$');
/** @type {Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Client} */
const rdbDto = await container.get('Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Client$');
/** @type {Fl64_Gpt_User_Back_Convert_OAuth2_Client} */
const converter = await container.get('Fl64_Gpt_User_Back_Convert_OAuth2_Client$');

describe('Fl64_Gpt_User_Back_Convert_OAuth2_Client', () => {
    const sampleRdbDto = rdbDto.createDto({
        client_id: 'example-client-id',
        client_secret: 'example-secret',
        date_created: new Date('2023-01-01T00:00:00Z'),
        id: 1,
        name: 'Example Client',
        redirect_uri: 'https://example.com/callback',
        status: 'ACTIVE',
    });

    const sampleDomDto = domDto.createDto({
        clientId: 'example-client-id',
        clientSecret: 'example-secret',
        dateCreated: new Date('2023-01-01T00:00:00Z'),
        id: 1,
        name: 'Example Client',
        redirectUri: 'https://example.com/callback',
        status: 'ACTIVE',
    });

    it('should convert RDB DTO to Domain DTO correctly', () => {
        const domDto = converter.db2dom({ dbClient: sampleRdbDto });
        assert.deepStrictEqual(domDto, sampleDomDto, 'Converted Domain DTO should match the sample Domain DTO');
    });

    it('should convert Domain DTO to RDB DTO correctly', () => {
        const { dbClient: rdbDto } = converter.dom2db({ client: sampleDomDto });
        assert.deepStrictEqual(rdbDto, sampleRdbDto, 'Converted RDB DTO should match the sample RDB DTO');
    });
});
