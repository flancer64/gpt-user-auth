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
/** @type {Fl64_Gpt_User_Back_Store_RDb_Schema_User_Session} */
const rdbSession = await container.get('Fl64_Gpt_User_Back_Store_RDb_Schema_User_Session$');
/** @type {Fl64_Gpt_User_Back_Store_RDb_Schema_Openai_User} */
const rdbOaiUser = await container.get('Fl64_Gpt_User_Back_Store_RDb_Schema_Openai_User$');
/** @type {Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Client} */
const rdbClient = await container.get('Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Client$');
/** @type {Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Code} */
const rdbCode = await container.get('Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Code$');
/** @type {Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Token} */
const rdbOAuthToken = await container.get('Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Token$');
/** @type {typeof Fl64_Gpt_User_Shared_Enum_User_Status} */
const STATUS = await container.get('Fl64_Gpt_User_Shared_Enum_User_Status.default');

let USER_ID;
let CLIENT_ID;

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
        assert.strictEqual(pk[ATTR.CODE], CODE);
    });

    it('should create a OpenAI user', async () => {
        let pk;
        const OAI_USER_ID = 'some-id-for-the-user';
        const ATTR = rdbOaiUser.getAttributes();
        const trx = await conn.startTransaction();
        try {
            const dto = rdbOaiUser.createDto();
            dto.ephemeral_id = OAI_USER_ID;
            dto.user_ref = USER_ID;
            pk = await crud.create(trx, rdbOaiUser, dto);
            await trx.commit();
        } catch (e) {
            await trx.rollback();
            logger.exception(e);
        }
        assert.strictEqual(pk[ATTR.EPHEMERAL_ID], OAI_USER_ID);
        assert.strictEqual(pk[ATTR.USER_REF], USER_ID);
    });

    it('should create a user session', async () => {
        let pk;
        const ATTR = rdbSession.getAttributes();
        const SESSION_ID = 'session-id-123';
        const trx = await conn.startTransaction();
        try {
            const dto = rdbSession.createDto();
            dto.session_id = SESSION_ID;
            dto.user_ref = USER_ID;
            dto.ip_address = '192.168.0.1';
            dto.user_agent = 'TestAgent';
            pk = await crud.create(trx, rdbSession, dto);
            await trx.commit();
        } catch (e) {
            await trx.rollback();
            logger.exception(e);
        }
        assert.strictEqual(pk[ATTR.SESSION_ID], SESSION_ID);
    });

    it('should create an OAuth2 client', async () => {
        let pk;
        const ATTR = rdbClient.getAttributes();
        const CLIENT_ID_VALUE = 'client-id-123';
        const trx = await conn.startTransaction();
        try {
            const dto = rdbClient.createDto();
            dto.client_id = CLIENT_ID_VALUE;
            dto.client_secret = 'secret';
            dto.name = 'Test Client';
            dto.redirect_uri = 'https://example.com/callback';
            dto.status = 'ACTIVE';
            pk = await crud.create(trx, rdbClient, dto);
            await trx.commit();
            CLIENT_ID = pk[ATTR.ID];
        } catch (e) {
            await trx.rollback();
            logger.exception(e);
        }
        assert.strictEqual(pk[ATTR.ID], CLIENT_ID);
    });

    it('should create an OAuth2 code', async () => {
        let pk;
        const ATTR = rdbCode.getAttributes();
        const CODE_VALUE = 'authorization-code-123';
        const trx = await conn.startTransaction();
        try {
            const dto = rdbCode.createDto();
            dto.code = CODE_VALUE;
            dto.client_ref = CLIENT_ID;
            dto.user_ref = USER_ID;
            dto.date_expired = new Date(Date.now() + 1000 * 60 * 5);
            dto.redirect_uri = 'https://example.com/callback';
            dto.scope = 'read write';
            pk = await crud.create(trx, rdbCode, dto);
            await trx.commit();
        } catch (e) {
            await trx.rollback();
            logger.exception(e);
        }
        assert.notEqual(pk[ATTR.ID], undefined);
    });

    it('should create an OAuth2 token', async () => {
        let pk;
        const ATTR = rdbOAuthToken.getAttributes();
        const ACCESS_TOKEN = 'access-token-123';
        const trx = await conn.startTransaction();
        try {
            const dto = rdbOAuthToken.createDto();
            dto.access_token = ACCESS_TOKEN;
            dto.refresh_token = 'refresh-token-123';
            dto.client_ref = CLIENT_ID;
            dto.user_ref = USER_ID;
            dto.date_expire = new Date(Date.now() + 1000 * 60 * 60);
            dto.scope = 'read';
            pk = await crud.create(trx, rdbOAuthToken, dto);
            await trx.commit();
        } catch (e) {
            await trx.rollback();
            logger.exception(e);
        }
        assert.notEqual(pk[ATTR.ID], undefined);
    });
});
