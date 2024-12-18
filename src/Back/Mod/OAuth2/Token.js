import {randomUUID} from 'crypto';

/**
 * Manages OAuth2 Token data in a relational database.
 *
 * Provides CRUD operations for OAuth2 tokens, including transaction-safe creation,
 * retrieval, updating, and deletion. Handles domain-to-database conversion and vice versa,
 * and supports filtering and listing tokens by various criteria.
 *
 * @implements TeqFw_Core_Shared_Api_Model
 */
export default class Fl64_Gpt_User_Back_Mod_OAuth2_Token {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {Fl64_Gpt_User_Shared_Dto_OAuth2_Token} dtoToken
     * @param {Fl64_Gpt_User_Back_Convert_OAuth2_Token} convToken
     * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
     * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Token} rdbToken
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            Fl64_Gpt_User_Shared_Dto_OAuth2_Token$: dtoToken,
            Fl64_Gpt_User_Back_Convert_OAuth2_Token$: convToken,
            TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
            Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Token$: rdbToken,
        }
    ) {
        // VARIABLES
        const ATTR = rdbToken.getAttributes();

        // HELPER FUNCTIONS
        async function createEntity(trx, dbToken) {
            const {[ATTR.ID]: id} = await crud.create(trx, rdbToken, dbToken);
            return id;
        }

        async function deleteEntity(trx, id) {
            return await crud.deleteOne(trx, rdbToken, {[ATTR.ID]: id});
        }

        async function readEntity(trx, id, access) {
            let key = id;
            if (access) key = {[ATTR.ACCESS_TOKEN]: access};
            return await crud.readOne(trx, rdbToken, key);
        }

        async function updateEntity(trx, dbToken) {
            return await crud.updateOne(trx, rdbToken, dbToken);
        }

        // MAIN METHODS
        /**
         * @type {function(Fl64_Gpt_User_Shared_Dto_OAuth2_Token.Dto=): Fl64_Gpt_User_Shared_Dto_OAuth2_Token.Dto}
         */
        this.composeEntity = dtoToken.createDto;

        /**
         * @type {function(Fl64_Gpt_User_Shared_Dto_OAuth2_Token.Dto=): Fl64_Gpt_User_Shared_Dto_OAuth2_Token.Dto}
         */
        this.composeItem = dtoToken.createDto;

        this.create = async function ({trx, dto}) {
            const trxLocal = trx ?? await conn.startTransaction();
            try {
                const {dbToken} = convToken.dom2db({token: dto});
                if (!dbToken.access_token) dbToken.access_token = randomUUID();
                if (!dbToken.refresh_token) dbToken.refresh_token = randomUUID();
                const id = await createEntity(trxLocal, dbToken);

                const createdDbToken = await readEntity(trxLocal, id);
                const result = convToken.db2dom({dbToken: createdDbToken});
                if (!trx) await trxLocal.commit();
                logger.info(`OAuth2 token #${id} created.`);
                return result;
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Failed to create OAuth2 token: ${error.message}`);
                throw error;
            }
        };

        this.read = async function ({trx, tokenId, tokenAccess}) {
            const trxLocal = trx ?? await conn.startTransaction();
            try {
                const dbToken = await readEntity(trxLocal, tokenId, tokenAccess);
                const result = dbToken ? convToken.db2dom({dbToken}) : null;
                if (!trx) await trxLocal.commit();
                logger.info(`OAuth2 token #${tokenId} retrieved.`);
                return result;
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Failed to retrieve OAuth2 token: ${error.message}`);
                throw error;
            }
        };

        this.delete = async function ({trx, tokenId}) {
            const trxLocal = trx ?? await conn.startTransaction();
            try {
                const deleted = await deleteEntity(trxLocal, tokenId);
                if (!trx) await trxLocal.commit();
                logger.info(`OAuth2 token #${tokenId} deleted.`);
                return deleted;
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Failed to delete OAuth2 token: ${error.message}`);
                throw error;
            }
        };

        this.list = async function ({trx, where} = {}) {
            const trxLocal = trx ?? await conn.startTransaction();
            try {
                const dbTokens = await crud.readSet(trxLocal, rdbToken, where);
                const results = dbTokens.map(dbToken => convToken.db2dom({dbToken}));
                if (!trx) await trxLocal.commit();
                logger.info(`Listed OAuth2 tokens.`);
                return results;
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Failed to list OAuth2 tokens: ${error.message}`);
                throw error;
            }
        };

        this.update = async function ({trx, dto}) {
            const trxLocal = trx ?? await conn.startTransaction();
            try {
                const {dbToken} = convToken.dom2db({token: dto});
                await updateEntity(trxLocal, dbToken);

                const updatedDbToken = await readEntity(trxLocal, dbToken.id);
                const result = convToken.db2dom({dbToken: updatedDbToken});
                if (!trx) await trxLocal.commit();
                logger.info(`OAuth2 token #${dbToken.id} updated.`);
                return result;
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Failed to update OAuth2 token: ${error.message}`);
                throw error;
            }
        };
    }
}
