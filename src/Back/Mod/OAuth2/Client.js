/**
 * Model for managing OAuth2 Client data in the RDB.
 *
 * @implements TeqFw_Core_Shared_Api_Model
 */
export default class Fl64_Gpt_User_Back_Mod_OAuth2_Client {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger - instance
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {Fl64_Gpt_User_Shared_Dto_OAuth2_Client} dtoClient
     * @param {Fl64_Gpt_User_Back_Convert_OAuth2_Client} convClient
     * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
     * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Client} rdbClient
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            Fl64_Gpt_User_Shared_Dto_OAuth2_Client$: dtoClient,
            Fl64_Gpt_User_Back_Convert_OAuth2_Client$: convClient,
            TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
            Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Client$: rdbClient,
        }
    ) {
        // VARS
        const ATTR = rdbClient.getAttributes();

        // INSTANCE METHODS

        /**
         * Executes the creation of a new OAuth2 client in the database.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx - The transaction context.
         * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Client.Dto} dbClient - The client DTO containing data for the new record.
         * @returns {Promise<{id:number}>} - The ID of the newly created client record.
         */
        async function createEntity({trx, dbClient}) {
            const {[ATTR.ID]: id} = await crud.create(trx, rdbClient, dbClient);
            return {id};
        }

        /**
         * Deletes a client from the database.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Client.Dto} [dbClient]
         * @returns {Promise<number>} - Number of deleted records
         */
        async function deleteEntity({trx, dbClient}) {
            return await crud.deleteOne(trx, rdbClient, {[ATTR.ID]: dbClient.id});
        }

        /**
         * Reads a client from the database by key.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {number} [id]
         * @param {string} [clientId]
         * @returns {Promise<{dbClient:Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Client.Dto}>} - Object containing the client data or an empty object if not found.
         */
        async function readEntity({trx, id, clientId}) {
            let dbClient;
            let key = null;

            if (id !== undefined) {
                key = {[ATTR.ID]: id};
            } else if (clientId !== undefined) {
                key = {[ATTR.CLIENT_ID]: clientId};
            }
            if (key) dbClient = await crud.readOne(trx, rdbClient, key);
            return {dbClient};
        }

        /**
         * Updates a client record in the database.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Client.Dto} dbClient
         * @returns {Promise<void>}
         */
        async function updateEntity({trx, dbClient}) {
            await crud.updateOne(trx, rdbClient, dbClient);
        }

        // MAIN

        /**
         * @type {function(Fl64_Gpt_User_Shared_Dto_OAuth2_Client.Dto=): Fl64_Gpt_User_Shared_Dto_OAuth2_Client.Dto}
         */
        this.composeEntity = dtoClient.createDto;
        /**
         * @type {function(Fl64_Gpt_User_Shared_Dto_OAuth2_Client.Dto=): Fl64_Gpt_User_Shared_Dto_OAuth2_Client.Dto}
         */
        this.composeItem = dtoClient.createDto;

        /**
         * Creates a new OAuth2 client in the RDB.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx]
         * @param {Fl64_Gpt_User_Shared_Dto_OAuth2_Client.Dto} dto
         * @returns {Promise<Fl64_Gpt_User_Shared_Dto_OAuth2_Client.Dto>}
         */
        this.create = async function ({trx, dto}) {
            const trxLocal = trx ?? await conn.startTransaction();
            try {
                const {dbClient} = convClient.dom2db({client: dto});
                const {id} = await createEntity({trx: trxLocal, dbClient});

                const {dbClient: createdClient} = await readEntity({trx: trxLocal, id});
                const res = convClient.db2dom({dbClient: createdClient});
                if (!trx) await trxLocal.commit();
                logger.info(`OAuth2 client with ID #${createdClient.id} created successfully.`);
                return res;
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Error creating OAuth2 client: ${error.message}`);
                throw error;
            }
        };

        /**
         * Deletes a client record from the database.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx]
         * @param {Fl64_Gpt_User_Shared_Dto_OAuth2_Client.Dto} dto
         * @returns {Promise<number>}
         */
        this.delete = async function ({trx, dto}) {
            const trxLocal = trx ?? await conn.startTransaction();
            try {
                const {dbClient} = convClient.dom2db({client: dto});
                const res = await deleteEntity({trx: trxLocal, dbClient});
                if (!trx) await trxLocal.commit();
                logger.info(`OAuth2 client deleted successfully with ID: ${dbClient.id}`);
                return res;
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Error deleting OAuth2 client: ${error.message}`);
                throw error;
            }
        };

        /**
         * Retrieves a list of all client records from the database as domain DTOs.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx]
         * @param {Object} [where]
         * @returns {Promise<Fl64_Gpt_User_Shared_Dto_OAuth2_Client.Dto[]>}
         * @throws {Error}
         */
        this.list = async function ({trx, where} = {}) {
            const trxLocal = trx ?? await conn.startTransaction();
            const result = [];
            try {
                const all = await crud.readSet(trxLocal, rdbClient, where);
                for (const one of all) {
                    result.push(convClient.db2dom({dbClient: one}));
                }
                if (!trx) await trxLocal.commit();
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                throw error;
            }
            return result;
        };

        /**
         * Reads client data by ID or client ID.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx]
         * @param {number} [id]
         * @param {string} [clientId]
         * @returns {Promise<Fl64_Gpt_User_Shared_Dto_OAuth2_Client.Dto|null>}
         */
        this.read = async function ({trx, id, clientId}) {
            const trxLocal = trx ?? await conn.startTransaction();
            let result = null;

            try {
                if (id || clientId) {
                    const {dbClient} = await readEntity({trx: trxLocal, id, clientId});
                    if (dbClient) {
                        result = convClient.db2dom({dbClient});
                        logger.info(`OAuth2 client read successfully with ID: ${result.id}`);
                    } else {
                        logger.info(`OAuth2 client not found with given keys (id/clientId: ${id ?? ''}/${clientId ?? ''}).`);
                    }
                }
                if (!trx) await trxLocal.commit();
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Error reading OAuth2 client: ${error.message}`);
                throw error;
            }

            return result;
        };

        /**
         * Updates client data in the RDB.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx]
         * @param {Fl64_Gpt_User_Shared_Dto_OAuth2_Client.Dto} dto
         * @returns {Promise<Fl64_Gpt_User_Shared_Dto_OAuth2_Client.Dto|null>}
         */
        this.update = async function ({trx, dto}) {
            const trxLocal = trx ?? await conn.startTransaction();
            try {
                const {dbClient} = await readEntity({trx: trxLocal, id: dto.id});
                if (dbClient) {
                    dbClient.client_id = dto.clientId;
                    dbClient.client_secret = dto.clientSecret;
                    dbClient.redirect_uri = dto.redirectUri;
                    dbClient.name = dto.name;
                    dbClient.status = dto.status;
                    await updateEntity({trx: trxLocal, dbClient});
                    logger.info(`OAuth2 client updated successfully with ID: ${dbClient.id}`);
                    const res = convClient.db2dom({dbClient});
                    if (!trx) await trxLocal.commit();
                    return res;
                } else {
                    logger.info(`OAuth2 client not found with ID: ${dto.id}`);
                    if (!trx) await trxLocal.commit();
                    return null;
                }
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Error updating OAuth2 client: ${error.message}`);
                throw error;
            }
        };
    }
}
