import {randomUUID} from 'crypto';

/**
 * Model for managing User Session data in the RDB.
 *
 * @implements TeqFw_Core_Shared_Api_Model
 */
export default class Fl64_Gpt_User_Back_Mod_User_Session {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger - instance
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {Fl64_Gpt_User_Shared_Dto_User_Session} dtoSession
     * @param {Fl64_Gpt_User_Back_Convert_User_Session} convSession
     * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
     * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_User_Session} rdbSession
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            Fl64_Gpt_User_Shared_Dto_User_Session$: dtoSession,
            Fl64_Gpt_User_Back_Convert_User_Session$: convSession,
            TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
            Fl64_Gpt_User_Back_Store_RDb_Schema_User_Session$: rdbSession,
        }
    ) {
        // VARS
        const ATTR = rdbSession.getAttributes();

        // FUNCS

        /**
         * Executes the creation of a new user session in the database.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx - The transaction context.
         * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_User_Session.Dto} dbSession - The session DTO containing data for the new record.
         * @returns {Promise<{id:string}>} - The session ID of the newly created user session record.
         */
        async function createEntity({trx, dbSession}) {
            const {[ATTR.SESSION_ID]: id} = await crud.create(trx, rdbSession, dbSession);
            return {id};
        }

        /**
         * Deletes a user session from the database.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_User_Session.Dto} [dbSession]
         * @returns {Promise<number>} - Number of deleted records
         */
        async function deleteEntity({trx, dbSession}) {
            return await crud.deleteOne(trx, rdbSession, {[ATTR.SESSION_ID]: dbSession.session_id});
        }

        /**
         * Reads a user session from the database by session ID.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {string} [sessionId]
         * @returns {Promise<{dbSession:Fl64_Gpt_User_Back_Store_RDb_Schema_User_Session.Dto}>} - Object containing the session data or an empty object if not found.
         */
        async function readEntity({trx, sessionId}) {
            let dbSession;
            if (sessionId !== undefined) {
                dbSession = await crud.readOne(trx, rdbSession, {[ATTR.SESSION_ID]: sessionId});
            }
            return {dbSession};
        }

        /**
         * Updates a user session record in the database.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_User_Session.Dto} dbSession
         * @returns {Promise<void>}
         */
        async function updateEntity({trx, dbSession}) {
            await crud.updateOne(trx, rdbSession, dbSession);
        }

        // MAIN

        /**
         * @type {function(Fl64_Gpt_User_Shared_Dto_User_Session.Dto=): Fl64_Gpt_User_Shared_Dto_User_Session.Dto}
         */
        this.composeEntity = dtoSession.createDto;

        /**
         * @type {function(Fl64_Gpt_User_Shared_Dto_User_Session.Dto=): Fl64_Gpt_User_Shared_Dto_User_Session.Dto}
         */
        this.composeItem = dtoSession.createDto;

        /**
         * Creates a new user session in the RDB.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx]
         * @param {Fl64_Gpt_User_Shared_Dto_User_Session.Dto} dto
         * @returns {Promise<Fl64_Gpt_User_Shared_Dto_User_Session.Dto>}
         */
        this.create = async function ({trx, dto}) {
            const trxLocal = trx ?? await conn.startTransaction();
            try {
                const {dbSession} = convSession.dom2db({session: dto});
                dbSession.session_id = randomUUID(); // Generate a random session ID
                await createEntity({trx: trxLocal, dbSession});
                const {dbSession: createdSession} = await readEntity({
                    trx: trxLocal,
                    sessionId: dbSession.session_id
                });
                const res = convSession.db2dom({dbSession: createdSession});
                if (!trx) await trxLocal.commit();
                logger.info(`User session created successfully with session ID: ${dbSession.session_id}`);
                return res;
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Error creating user session: ${error.message}`);
                throw error;
            }
        };

        /**
         * Deletes a user session from the RDB.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx]
         * @param {Fl64_Gpt_User_Shared_Dto_User_Session.Dto} dto
         * @returns {Promise<number>}
         */
        this.delete = async function ({trx, dto}) {
            const trxLocal = trx ?? await conn.startTransaction();
            try {
                const {dbSession} = convSession.dom2db({session: dto});
                const res = await deleteEntity({trx: trxLocal, dbSession});
                if (!trx) await trxLocal.commit();
                logger.info(`User session deleted successfully with session ID: ${dbSession.session_id}`);
                return res;
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Error deleting user session: ${error.message}`);
                throw error;
            }
        };

        /**
         * Retrieves a list of all user session records from the database as domain DTOs.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx]
         * @param {Object} [where]
         * @returns {Promise<Fl64_Gpt_User_Shared_Dto_User_Session.Dto[]>}
         * @throws {Error}
         */
        this.list = async function ({trx, where} = {}) {
            const trxLocal = trx ?? await conn.startTransaction();
            const result = [];
            try {
                const all = await crud.readSet(trxLocal, rdbSession, where);
                for (const one of all) {
                    result.push(convSession.db2dom({dbSession: one}));
                }
                if (!trx) await trxLocal.commit();
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                throw error;
            }
            return result;
        };

        /**
         * Reads user session data by session reference.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx]
         * @param {string} sessionId
         * @returns {Promise<Fl64_Gpt_User_Shared_Dto_User_Session.Dto|null>}
         */
        this.read = async function ({trx, sessionId}) {
            const trxLocal = trx ?? await conn.startTransaction();
            let result = null;

            try {
                if (sessionId) {
                    const {dbSession} = await readEntity({trx: trxLocal, sessionId});
                    if (dbSession) {
                        result = convSession.db2dom({dbSession});
                        logger.info(`User session read successfully with session ID: ${result.sessionId}`);
                    } else {
                        logger.info(`User session with given session ID: ${sessionId} not found.`);
                    }
                }
                if (!trx) await trxLocal.commit();
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Error reading user session: ${error.message}`);
                throw error;
            }

            return result;
        };

        /**
         * Updates user session data in the RDB.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx]
         * @param {Fl64_Gpt_User_Shared_Dto_User_Session.Dto} dto
         * @returns {Promise<Fl64_Gpt_User_Shared_Dto_User_Session.Dto|null>}
         */
        this.update = async function ({trx, dto}) {
            const trxLocal = trx ?? await conn.startTransaction();
            try {
                const {dbSession} = await readEntity({trx: trxLocal, sessionId: dto.sessionId});
                if (dbSession) {
                    dbSession.ip_address = dto.ipAddress;
                    dbSession.user_agent = dto.userAgent;
                    await updateEntity({trx: trxLocal, dbSession});
                    logger.info(`User session updated successfully with session ID: ${dbSession.session_id}`);
                    const res = convSession.db2dom({dbSession});
                    if (!trx) await trxLocal.commit();
                    return res;
                } else {
                    logger.info(`User session not found with session ID: ${dto.sessionId}`);
                    if (!trx) await trxLocal.commit();
                    return null;
                }
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Error updating user session: ${error.message}`);
                throw error;
            }
        };
    }
}
