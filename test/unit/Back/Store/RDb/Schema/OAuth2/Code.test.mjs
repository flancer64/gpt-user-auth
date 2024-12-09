import {container} from '@teqfw/test';
import assert from 'assert';

// GET OBJECT FROM CONTAINER
/** @type {Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Code} */
const rdbDto = await container.get('Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Code$');
/** @type {Fl64_Gpt_User_Back_Defaults} */
const DEF = await container.get('Fl64_Gpt_User_Back_Defaults$');

describe('Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Code', () => {
    const ATTR = rdbDto.getAttributes();
    const sampleData = {
        id: 1,
        code: 'example_code',
        client_id: 123,
        user_id: 456,
        expires_at: new Date('2024-01-01T00:00:00Z'),
        redirect_uri: 'https://example.com/callback',
        scope: 'read write',
    };

    it('should return correct attribute mappings', () => {
        const expectedAttrs = [
            'CLIENT_ID',
            'CODE',
            'DATE_CREATED',
            'EXPIRES_AT',
            'ID',
            'REDIRECT_URI',
            'SCOPE',
            'USER_ID',
        ];
        assert.deepStrictEqual(Object.keys(ATTR).sort(), expectedAttrs.sort(), 'Attribute mappings should match');
    });

    it('should have the correct ENTITY name and primary key', async () => {
        const expectedEntityName = `${DEF.NAME}/fl64/gpt/oauth/code`;
        assert.equal(rdbDto.getEntityName(), expectedEntityName, 'Entity name should match the expected path');
        assert.deepStrictEqual(rdbDto.getPrimaryKey(), [ATTR.ID], 'Primary key should be set to ID');
    });


    it('should create DTO with correct attributes', () => {
        const dto = rdbDto.createDto(sampleData);

        assert.strictEqual(dto.id, sampleData.id, 'ID should match');
        assert.strictEqual(dto.code, sampleData.code, 'Code should match');
        assert.strictEqual(dto.client_id, sampleData.client_id, 'Client ID should match');
        assert.strictEqual(dto.user_id, sampleData.user_id, 'User ID should match');
        assert.deepStrictEqual(dto.expires_at, sampleData.expires_at, 'Expiration time should match');
        assert.strictEqual(dto.redirect_uri, sampleData.redirect_uri, 'Redirect URI should match');
        assert.strictEqual(dto.scope, sampleData.scope, 'Scope should match');
    });
});
