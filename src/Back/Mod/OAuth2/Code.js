/**
 * Manages OAuth2 Authorization Code data in a relational database.
 *
 * This model provides CRUD operations for OAuth2 authorization codes,
 * including transaction-safe creation, retrieval, updating, and deletion.
 * It handles domain-to-database conversion and vice versa, and supports filtering
 * and listing of authorization codes by various criteria.
 *
 * Dependencies include a logger, database connection, CRUD engine,
 * and data converters for seamless integration between domain and database layers.
 *
 * @implements TeqFw_Core_Shared_Api_Model
 */
export default class Fl64_Gpt_User_Back_Mod_OAuth2_Code {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {Fl64_Gpt_User_Shared_Dto_OAuth2_Code} dtoCode
     * @param {Fl64_Gpt_User_Back_Convert_OAuth2_Code} convCode
     * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
     * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Code} rdbCode
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            Fl64_Gpt_User_Shared_Dto_OAuth2_Code$: dtoCode,
            Fl64_Gpt_User_Back_Convert_OAuth2_Code$: convCode,
            TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
            Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Code$: rdbCode,
        }
    ) {
        // VARIABLES
        const ATTR = rdbCode.getAttributes();

        // HELPER FUNCTIONS
        /**
         * Creates a new OAuth2 authorization code record.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx - The transaction context.
         * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Code.Dto} dbCode - The code data to persist.
         * @returns {Promise<number>} - The ID of the newly created record.
         */
        async function createEntity({trx, dbCode}) {
            const {[ATTR.ID]: id} = await crud.create(trx, rdbCode, dbCode);
            return id;
        }

        /**
         * Deletes an OAuth2 authorization code record.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx - The transaction context.
         * @param {number} id - The ID of the code to delete.
         * @returns {Promise<number>} - The number of records deleted.
         */
        async function deleteEntity({trx, id}) {
            return await crud.deleteOne(trx, rdbCode, {[ATTR.ID]: id});
        }

        /**
         * Reads an OAuth2 authorization code by ID.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx - The transaction context.
         * @param {number} id - The ID of the code to retrieve.
         * @returns {Promise<Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Code.Dto|null>} - The retrieved record or `null`.
         */
        async function readEntity({trx, id}) {
            return await crud.readOne(trx, rdbCode, {[ATTR.ID]: id});
        }

        /**
         * Updates an existing OAuth2 authorization code record.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx - The transaction context.
         * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Code.Dto} dbCode - The updated data.
         * @returns {Promise<number>} - The number of updated records.
         */
        async function updateEntity({trx, dbCode}) {
            return await crud.updateOne(trx, rdbCode, dbCode);
        }

        // MAIN METHODS

        /**
         * Composes a new domain DTO.
         *
         * @type {function(Fl64_Gpt_User_Shared_Dto_OAuth2_Code.Dto=): Fl64_Gpt_User_Shared_Dto_OAuth2_Code.Dto}
         */
        this.composeEntity = dtoCode.createDto;

        /**
         * Composes a list item DTO.
         *
         * @type {function(Fl64_Gpt_User_Shared_Dto_OAuth2_Code.Dto=): Fl64_Gpt_User_Shared_Dto_OAuth2_Code.Dto}
         */
        this.composeItem = dtoCode.createDto;

        /**
         * Creates a new OAuth2 authorization code.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx] - Optional transaction context.
         * @param {Fl64_Gpt_User_Shared_Dto_OAuth2_Code.Dto} dto - The code data to create.
         * @returns {Promise<Fl64_Gpt_User_Shared_Dto_OAuth2_Code.Dto>}
         */
        this.create = async function ({trx, dto}) {
            const trxLocal = trx ?? await conn.startTransaction();
            try {
                const {dbCode} = convCode.dom2db({code: dto});
                const id = await createEntity({trx: trxLocal, dbCode});

                const createdDbCode = await readEntity({trx: trxLocal, id});
                const res = convCode.db2dom({dbCode: createdDbCode});
                if (!trx) await trxLocal.commit();
                logger.info(`OAuth2 authorization code #${id} created.`);
                return res;
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Failed to create OAuth2 authorization code: ${error.message}`);
                throw error;
            }
        };

        /**
         * Reads an OAuth2 authorization code by ID.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx] - Optional transaction context.
         * @param {number} id - The ID of the code to retrieve.
         * @returns {Promise<Fl64_Gpt_User_Shared_Dto_OAuth2_Code.Dto|null>}
         */
        this.read = async function ({trx, id}) {
            const trxLocal = trx ?? await conn.startTransaction();
            try {
                const dbCode = await readEntity({trx: trxLocal, id});
                const res = dbCode ? convCode.db2dom({dbCode}) : null;
                if (!trx) await trxLocal.commit();
                logger.info(`OAuth2 authorization code #${id} retrieved.`);
                return res;
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Failed to retrieve OAuth2 authorization code: ${error.message}`);
                throw error;
            }
        };

        /**
         * Deletes an OAuth2 authorization code by ID.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx] - Optional transaction context.
         * @param {number} id - The ID of the code to delete.
         * @returns {Promise<number>}
         */
        this.delete = async function ({trx, id}) {
            const trxLocal = trx ?? await conn.startTransaction();
            try {
                const deleted = await deleteEntity({trx: trxLocal, id});
                if (!trx) await trxLocal.commit();
                logger.info(`OAuth2 authorization code #${id} deleted.`);
                return deleted;
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Failed to delete OAuth2 authorization code: ${error.message}`);
                throw error;
            }
        };

        /**
         * Lists all OAuth2 authorization codes.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx] - Optional transaction context.
         * @param {Object} [where] - Filtering criteria.
         * @returns {Promise<Fl64_Gpt_User_Shared_Dto_OAuth2_Code.Dto[]>}
         */
        this.list = async function ({trx, where} = {}) {
            const trxLocal = trx ?? await conn.startTransaction();
            try {
                const dbCodes = await crud.readSet(trxLocal, rdbCode, where);
                const res = dbCodes.map(dbCode => convCode.db2dom({dbCode}));
                if (!trx) await trxLocal.commit();
                logger.info(`Listed OAuth2 authorization codes.`);
                return res;
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Failed to list OAuth2 authorization codes: ${error.message}`);
                throw error;
            }
        };

        /**
         * Updates an existing OAuth2 authorization code.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx] - Optional transaction context.
         * @param {Fl64_Gpt_User_Shared_Dto_OAuth2_Code.Dto} dto - Updated code data.
         * @returns {Promise<Fl64_Gpt_User_Shared_Dto_OAuth2_Code.Dto>}
         */
        this.update = async function ({trx, dto}) {
            const trxLocal = trx ?? await conn.startTransaction();
            try {
                const {dbCode} = convCode.dom2db({code: dto});
                await updateEntity({trx: trxLocal, dbCode});
                const updatedDbCode = await readEntity({trx: trxLocal, id: dbCode.id});
                const res = convCode.db2dom({dbCode: updatedDbCode});
                if (!trx) await trxLocal.commit();
                logger.info(`OAuth2 authorization code #${dbCode.id} updated.`);
                return res;
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Failed to update OAuth2 authorization code: ${error.message}`);
                throw error;
            }
        };
    }
}
