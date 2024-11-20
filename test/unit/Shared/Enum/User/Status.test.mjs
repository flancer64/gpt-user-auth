import {container} from '@teqfw/test';
import assert from 'assert';

// GET OBJECTS FROM CONTAINER
/** @type {typeof Fl64_Gpt_User_Shared_Enum_User_Status} */
const STATUS = await container.get('Fl64_Gpt_User_Shared_Enum_User_Status.default');

describe('Fl64_Gpt_User_Shared_Enum_User_Status', () => {

    it('should have exactly the expected statuses', () => {
        const actualKeys = Object.keys(STATUS);
        const expectedKeys = [
            'ACTIVE',
            'BLOCKED',
            'UNVERIFIED'
        ];

        assert.deepStrictEqual(
            actualKeys.sort(),
            expectedKeys.sort(),
            'Enum should only contain the expected keys.'
        );
    });

    it('should be frozen', () => {
        assert.ok(Object.isFrozen(STATUS), 'Enum object should be frozen');
    });

});
