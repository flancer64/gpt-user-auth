import {container} from '@teqfw/test';
import assert from 'assert';

// GET OBJECTS FROM CONTAINER
/** @type {typeof Fl64_Gpt_User_Shared_Enum_Token_Type} */
const TYPE = await container.get('Fl64_Gpt_User_Shared_Enum_Token_Type.default');

describe('Fl64_Gpt_User_Shared_Enum_Token_Type', () => {

    it('should have exactly the expected statuses', () => {
        const actualKeys = Object.keys(TYPE);
        const expectedKeys = [
            'ACCOUNT_UNLOCK',
            'EMAIL_VERIFICATION',
            'PROFILE_EDIT',
        ];

        assert.deepStrictEqual(
            actualKeys.sort(),
            expectedKeys.sort(),
            'Enum should only contain the expected keys.'
        );
    });

    it('should be frozen', () => {
        assert.ok(Object.isFrozen(TYPE), 'Enum object should be frozen');
    });

});
