import {container} from '@teqfw/test';
import assert from 'assert';

// GET OBJECTS FROM CONTAINER
/** @type {Fl64_Gpt_User_Back_Store_Context_HttpRequest} */
const contextRepo = await container.get('Fl64_Gpt_User_Back_Store_Context_HttpRequest$');
/** @type {Fl64_Gpt_User_Back_Defaults} */
const DEF = await container.get('Fl64_Gpt_User_Back_Defaults$');
/** @type {Fl64_Gpt_User_Back_Dto_OAuth2_Context} */
const dtoFactory = await container.get('Fl64_Gpt_User_Back_Dto_OAuth2_Context$');

// MOCK CONTEXT
const mockContext = {};

// TEST DATA
const testData = dtoFactory.createDto();
testData.clientId = 123;
testData.userId = 456;
const SPACE = DEF.NAME + '/oauth2Context';

describe('Fl64_Gpt_User_Back_Store_Context_HttpRequest', () => {
    it('should successfully compose entity', async () => {
        const entity = contextRepo.composeEntity();
        // Check if entity and item are correctly composed
        assert.ok(entity, 'Entity should be composed successfully');
        assert.strictEqual(typeof entity, 'object', 'Composed entity should be of type object');
    });

    it('should create a new entry in the context', () => {
        contextRepo.create(mockContext, testData);
        assert.deepStrictEqual(mockContext[SPACE], testData);
    });

    it('should read the data from the context', () => {
        const result = contextRepo.read(mockContext);
        assert.deepStrictEqual(result, testData);
    });

    it('should update existing data in the context', () => {
        const updatedData = dtoFactory.createDto(testData);
        updatedData.clientId = 789;
        contextRepo.update(mockContext, updatedData);
        assert.strictEqual(mockContext[SPACE].clientId, 789);
        assert.strictEqual(mockContext[SPACE].userId, 456); // Ensure userId remains unchanged
    });

    it('should delete the data from the context', () => {
        contextRepo.delete(mockContext);
        assert.strictEqual(mockContext[SPACE], undefined);
    });
});
