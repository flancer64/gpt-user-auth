import {container} from '@teqfw/test';
import assert from 'assert';

// GET OBJECTS FROM CONTAINER
/** @type {Fl64_Gpt_User_Shared_Dto_OAuth2_Client} */
const domDto = await container.get('Fl64_Gpt_User_Shared_Dto_OAuth2_Client$');
/** @type {Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Client} */
const rdbDto = await container.get('Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Client$');
/** @type {Fl64_Gpt_User_Back_Convert_OAuth2_Client} */
const converter = await container.get('Fl64_Gpt_User_Back_Convert_OAuth2_Client$');

describe('Fl64_Gpt_User_Back_Convert_OAuth2_Client', () => {
    const sampleRdbDto = rdbDto.createDto();
    sampleRdbDto.client_id = 'example-client-id';
    sampleRdbDto.client_secret = 'example-secret';
    sampleRdbDto.date_created = new Date('2023-01-01T00:00:00Z');
    sampleRdbDto.id = 1;
    sampleRdbDto.name = 'Example Client';
    sampleRdbDto.redirect_uri = 'https://example.com/callback';
    sampleRdbDto.status = 'ACTIVE';

    const sampleDomDto = domDto.createDto();
    sampleDomDto.clientId = 'example-client-id';
    sampleDomDto.clientSecret = 'example-secret';
    sampleDomDto.dateCreated = new Date('2023-01-01T00:00:00Z');
    sampleDomDto.id = 1;
    sampleDomDto.name = 'Example Client';
    sampleDomDto.redirectUri = 'https://example.com/callback';
    sampleDomDto.status = 'ACTIVE';

    it('should convert RDB DTO to Domain DTO correctly', () => {
        const domDtoResult = converter.db2dom({dbClient: sampleRdbDto});
        assert.deepStrictEqual(domDtoResult, sampleDomDto, 'Converted Domain DTO should match the sample Domain DTO');
    });

    it('should convert Domain DTO to RDB DTO correctly', () => {
        const {dbClient: rdbDtoResult} = converter.dom2db({client: sampleDomDto});
        assert.deepStrictEqual(rdbDtoResult, sampleRdbDto, 'Converted RDB DTO should match the sample RDB DTO');
    });
});
