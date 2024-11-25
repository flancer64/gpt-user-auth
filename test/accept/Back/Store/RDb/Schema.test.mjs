import assert from 'assert';
import {createContainer} from '@teqfw/test';
import {dbConnect, dbCreateFkEntities, dbDisconnect, dbReset, initConfig} from '../../../common.mjs';

// SETUP CONTAINER
const container = await createContainer();
await initConfig(container);

// SETUP ENVIRONMENT
/** @type {TeqFw_Core_Shared_Api_Logger} */
const logger = await container.get('TeqFw_Core_Shared_Api_Logger$$');
/** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
const crud = await container.get('TeqFw_Db_Back_Api_RDb_CrudEngine$');
/** @type {Fl64_Gpt_User_Back_Store_RDb_Schema_Token} */
const rdbToken = await container.get('Fl64_Gpt_User_Back_Store_RDb_Schema_Token$');
/** @type {Fl64_Gpt_User_Back_Store_RDb_Schema_User} */
const rdbUser = await container.get('Fl64_Gpt_User_Back_Store_RDb_Schema_User$');
/** @type {typeof Fl64_Gpt_User_Shared_Enum_User_Status} */
const STATUS = await container.get('Fl64_Gpt_User_Shared_Enum_User_Status.default');

let USER_ID;


describe('RDb schema', () => {
    /** @type {TeqFw_Db_Back_RDb_Connect} */
    let conn;

    before(async () => {
        await dbReset(container);
        const {user} = await dbCreateFkEntities(container);
        USER_ID = user.id;
        await dbConnect(container);
        conn = await container.get('TeqFw_Db_Back_RDb_IConnect$');
    });

    after(async () => {
        await dbDisconnect(container);
    });

    it('should create a user', async () => {
        let pk;
        const ATTR = rdbUser.getAttributes();
        const trx = await conn.startTransaction();
        try {
            const dto = rdbUser.createDto();
            dto.email = 'address@mail.com';
            dto.locale = 'es-ES';
            dto.pass_hash = 'hash';
            dto.pass_salt = 'salt';
            dto.pin = 1024;
            dto.status = STATUS.UNVERIFIED;
            dto.user_ref = USER_ID;
            pk = await crud.create(trx, rdbUser, dto);
            await trx.commit();
        } catch (e) {
            await trx.rollback();
            logger.exception(e);
        }
        // Assertion
        assert.strictEqual(pk[ATTR.USER_REF], USER_ID);

    });

    it('should create a token', async () => {
        let pk;
        const CODE = 'some code for the token';
        const ATTR = rdbToken.getAttributes();
        const trx = await conn.startTransaction();
        try {
            const dto = rdbToken.createDto();
            dto.user_ref = USER_ID;
            dto.type = 'TEST_TYPE';
            dto.code = CODE;
            pk = await crud.create(trx, rdbToken, dto);
            await trx.commit();
        } catch (e) {
            await trx.rollback();
            logger.exception(e);
        }
        // Assertion
        assert.strictEqual(pk[ATTR.CODE], CODE);
    });
});
