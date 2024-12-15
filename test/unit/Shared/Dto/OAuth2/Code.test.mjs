import {container} from '@teqfw/test';
import assert from 'assert';

// GET OBJECT FROM CONTAINER
/** @type {Fl64_Gpt_User_Shared_Dto_OAuth2_Code} */
const domDto = await container.get('Fl64_Gpt_User_Shared_Dto_OAuth2_Code$');

describe('Fl64_Gpt_User_Shared_Dto_OAuth2_Code', () => {
    const expectedProperties = [
        'clientId',
        'code',
        'dateExpired',
        'id',
        'redirectUri',
        'scope',
        'userRef',
    ];

    it('should create a Domain DTO with only the expected properties', () => {
        const dto = new domDto.createDto();
        const dtoKeys = Object.keys(dto).sort();

        assert.deepStrictEqual(
            dtoKeys,
            expectedProperties.sort(),
            'DTO should contain only the expected properties'
        );

        expectedProperties.forEach(prop =>
            assert.strictEqual(
                dto[prop],
                undefined,
                `Property "${prop}" should initially be undefined`
            )
        );
    });

    it('should populate a Domain DTO with provided data', () => {
        const sampleData = {
            id: 1,
            code: 'sample-code',
            clientId: 1001,
            userId: 5005,
            expiresAt: new Date('2023-01-01T00:00:00Z'),
            redirectUri: 'https://example.com/callback',
            scope: 'read write',
        };

        const dto = domDto.createDto(sampleData);

        assert.strictEqual(dto.id, sampleData.id, 'DTO id should match');
        assert.strictEqual(dto.code, sampleData.code, 'DTO code should match');
        assert.strictEqual(dto.clientId, sampleData.clientId, 'DTO clientId should match');
        assert.strictEqual(dto.userRef, sampleData.userRef, 'DTO userId should match');
        assert.deepStrictEqual(dto.dateExpired, sampleData.dateExpired, 'DTO expiresAt should match');
        assert.strictEqual(dto.redirectUri, sampleData.redirectUri, 'DTO redirectUri should match');
        assert.strictEqual(dto.scope, sampleData.scope, 'DTO scope should match');
    });
});
