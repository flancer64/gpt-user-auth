import {container} from '@teqfw/test';
import assert from 'assert';

// GET OBJECTS FROM CONTAINER
/** @type {Fl64_Gpt_User_Shared_Dto_User_Session} */
const domDto = await container.get('Fl64_Gpt_User_Shared_Dto_User_Session$');
/** @type {Fl64_Gpt_User_Back_Store_RDb_Schema_User_Session} */
const rdbDto = await container.get('Fl64_Gpt_User_Back_Store_RDb_Schema_User_Session$');
/** @type {Fl64_Gpt_User_Back_Convert_User_Session} */
const converter = await container.get('Fl64_Gpt_User_Back_Convert_User_Session$');

describe('Fl64_Gpt_User_Back_Convert_User_Session', () => {
    const sampleRdbDto = rdbDto.createDto({
        date_created: new Date('2023-01-01T00:00:00Z'),
        session_id: 'abc123',
        user_ref: 42,
        ip_address: '192.168.1.1',
        user_agent: 'Mozilla/5.0',
    });

    const sampleDomDto = domDto.createDto({
        dateCreated: new Date('2023-01-01T00:00:00Z'),
        sessionId: 'abc123',
        userRef: 42,
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
    });

    it('should convert RDB DTO to Domain DTO correctly', () => {
        const domDto = converter.db2dom({dbSession: sampleRdbDto});
        assert.deepStrictEqual(domDto, sampleDomDto, 'Converted Domain DTO should match the sample Domain DTO');
    });

    it('should convert Domain DTO to RDB DTO correctly', () => {
        const {dbSession: rdbDto} = converter.dom2db({session: sampleDomDto});
        assert.deepStrictEqual(rdbDto, sampleRdbDto, 'Converted RDB DTO should match the sample RDB DTO');
    });
});
