/**
 * Model for managing OpenAI user data in the relational database.
 *
 * @implements TeqFw_Core_Shared_Api_Model
 */
export default class Fl64_Gpt_User_Back_Mod_Openai_User {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {Fl64_Gpt_User_Shared_Dto_Openai_User} dtoUser
     * @param {Fl64_Gpt_User_Back_Convert_Openai_User} convUser
     * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
     * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_Openai_User} rdbUser
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            Fl64_Gpt_User_Shared_Dto_Openai_User$: dtoUser,
            Fl64_Gpt_User_Back_Convert_Openai_User$: convUser,
            TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
            Fl64_Gpt_User_Back_Store_RDb_Schema_Openai_User$: rdbUser,
        }
    ) {
        // VARS
        const ATTR = rdbUser.getAttributes();

        // FUNCS

        /**
         * Creates a new OpenAI user record in the database.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx - The transaction context.
         * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_Openai_User.Dto} dbUser - The user data to be persisted.
         * @returns {Promise<{id: number}>} - The identifier of the newly created user.
         */
        async function createEntity({trx, dbUser}) {
            await crud.create(trx, rdbUser, dbUser);
            return {id: dbUser.user_ref};
        }

        /**
         * Removes an OpenAI user record from the database.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx - The transaction context.
         * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_Openai_User.Dto} [dbUser] - The user data identifying the record to delete.
         * @returns {Promise<number>} - The number of records deleted.
         */
        async function deleteEntity({trx, dbUser}) {
            return await crud.deleteOne(trx, rdbUser, {[ATTR.USER_REF]: dbUser.user_ref});
        }

        /**
         * Retrieves an OpenAI user record based on user reference or ephemeral ID.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx - The transaction context.
         * @param {number} [userRef] - The reference ID of the user.
         * @param {string} [ephemeralId] - The ephemeral identifier of the user.
         * @returns {Promise<{dbUser: Fl64_Gpt_User_Back_Store_RDb_Schema_Openai_User.Dto}>} - The retrieved user data.
         */
        async function readEntity({trx, userRef, ephemeralId}) {
            let dbUser;
            let key = {
                [ATTR.EPHEMERAL_ID]: ephemeralId,
                [ATTR.USER_REF]: userRef,
            };
            dbUser = await crud.readOne(trx, rdbUser, key);
            return {dbUser};
        }

        /**
         * Updates an existing OpenAI user record in the database.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx - The transaction context.
         * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_Openai_User.Dto} dbUser - The user data to update.
         * @returns {Promise<void>}
         */
        async function updateEntity({trx, dbUser}) {
            await crud.updateOne(trx, rdbUser, dbUser);
        }

        // MAIN

        /**
         * Constructs a domain DTO from the provided data.
         *
         * @type {function(Fl64_Gpt_User_Shared_Dto_Openai_User.Dto=): Fl64_Gpt_User_Shared_Dto_Openai_User.Dto}
         */
        this.composeEntity = dtoUser.createDto;

        /**
         * Constructs a domain DTO for a single item.
         *
         * @type {function(Fl64_Gpt_User_Shared_Dto_Openai_User.Dto=): Fl64_Gpt_User_Shared_Dto_Openai_User.Dto}
         */
        this.composeItem = dtoUser.createDto;

        /**
         * Creates a new OpenAI user in the database.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx] - Optional transaction context.
         * @param {Fl64_Gpt_User_Shared_Dto_Openai_User.Dto} dto - The user data to create.
         * @returns {Promise<Fl64_Gpt_User_Shared_Dto_Openai_User.Dto>}
         * @throws {Error} If the creation process fails.
         */
        this.create = async function ({trx, dto}) {
            const trxLocal = trx ?? await conn.startTransaction();
            try {
                const {dbUser} = convUser.dom2db({user: dto});
                const {id} = await createEntity({trx: trxLocal, dbUser});

                const {dbUser: createdUser} = await readEntity({
                    trx: trxLocal,
                    userRef: id,
                    ephemeralId: dto.ephemeralId
                });
                const res = convUser.db2dom({dbUser: createdUser});
                if (!trx) await trxLocal.commit();
                logger.info(`OpenAI user created with ID: ${createdUser.user_ref}.`);
                return res;
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Failed to create OpenAI user: ${error.message}`);
                throw error;
            }
        };

        /**
         * Removes an OpenAI user from the database.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx] - Optional transaction context.
         * @param {Fl64_Gpt_User_Shared_Dto_Openai_User.Dto} dto - The user data identifying the user to delete.
         * @returns {Promise<number>} - The number of records deleted.
         * @throws {Error} If the deletion process fails.
         */
        this.delete = async function ({trx, dto}) {
            const trxLocal = trx ?? await conn.startTransaction();
            try {
                const {dbUser} = convUser.dom2db({user: dto});
                const res = await deleteEntity({trx: trxLocal, dbUser});
                if (!trx) await trxLocal.commit();
                logger.info(`OpenAI user with ID ${dbUser.user_ref} successfully deleted.`);
                return res;
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Failed to delete OpenAI user: ${error.message}`);
                throw error;
            }
        };

        /**
         * Retrieves a list of OpenAI users based on specified criteria.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx] - Optional transaction context.
         * @param {Object} [where] - Filter conditions for querying users.
         * @returns {Promise<Fl64_Gpt_User_Shared_Dto_Openai_User.Dto[]>}
         * @throws {Error} If the retrieval process fails.
         */
        this.list = async function ({trx, where} = {}) {
            const trxLocal = trx ?? await conn.startTransaction();
            const result = [];
            try {
                const all = await crud.readSet(trxLocal, rdbUser, where);
                for (const one of all) {
                    result.push(convUser.db2dom({dbUser: one}));
                }
                if (!trx) await trxLocal.commit();
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                throw error;
            }
            return result;
        };

        /**
         * Retrieves OpenAI users associated with a specific user reference.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx] - Optional transaction context.
         * @param {number} userRef - The reference ID of the user.
         * @returns {Promise<Fl64_Gpt_User_Shared_Dto_Openai_User.Dto[]>}
         * @throws {Error} If the retrieval process fails.
         */
        this.listByUserRef = async function ({trx, userRef}) {
            const trxLocal = trx ?? await conn.startTransaction();
            const result = [];
            try {
                const all = await crud.readSet(trxLocal, rdbUser, {[ATTR.USER_REF]: userRef});
                for (const one of all) {
                    result.push(convUser.db2dom({dbUser: one}));
                }
                if (!trx) await trxLocal.commit();
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                throw error;
            }
            return result;
        };

        /**
         * Fetches an OpenAI user based on user reference or ephemeral ID.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx] - Optional transaction context.
         * @param {number} [userRef] - The reference ID of the user.
         * @param {string} [ephemeralId] - The ephemeral identifier of the user.
         * @returns {Promise<Fl64_Gpt_User_Shared_Dto_Openai_User.Dto|null>}
         * @throws {Error} If the retrieval process fails.
         */
        this.read = async function ({trx, userRef, ephemeralId}) {
            const trxLocal = trx ?? await conn.startTransaction();
            let result = null;

            try {
                const {dbUser} = await readEntity({trx: trxLocal, userRef, ephemeralId});
                if (dbUser) {
                    result = convUser.db2dom({dbUser});
                    logger.info(`OpenAI user retrieved with ID: ${result.userRef}.`);
                } else {
                    logger.info(`No OpenAI user found with userRef: ${userRef} or ephemeralId: ${ephemeralId}.`);
                }
                if (!trx) await trxLocal.commit();
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Failed to read OpenAI user: ${error.message}`);
                throw error;
            }

            return result;
        };

        /**
         * Updates the information of an existing OpenAI user.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx] - Optional transaction context.
         * @param {Fl64_Gpt_User_Shared_Dto_Openai_User.Dto} dto - The updated user data.
         * @returns {Promise<Fl64_Gpt_User_Shared_Dto_Openai_User.Dto|null>}
         * @throws {Error} If the update process fails.
         */
        this.update = async function ({trx, dto}) {
            const trxLocal = trx ?? await conn.startTransaction();
            try {
                const {dbUser} = await readEntity({trx: trxLocal, userRef: dto.userRef, ephemeralId: dto.ephemeralId});
                if (dbUser) {
                    dbUser.date_last = dto.dateLast;
                    await updateEntity({trx: trxLocal, dbUser});
                    logger.info(`OpenAI user with ID ${dbUser.user_ref} successfully updated.`);
                    const res = convUser.db2dom({dbUser});
                    if (!trx) await trxLocal.commit();
                    return res;
                } else {
                    logger.info(`OpenAI user not found with userRef: ${dto.userRef}.`);
                    if (!trx) await trxLocal.commit();
                    return null;
                }
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Failed to update OpenAI user: ${error.message}`);
                throw error;
            }
        };

        /**
         * Updates the last action date of an OpenAI user.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx] - Optional transaction context.
         * @param {number} userRef - The reference ID of the user.
         * @param {string} ephemeralId - The ephemeral identifier of the user.
         * @returns {Promise<Fl64_Gpt_User_Shared_Dto_Openai_User.Dto|null>}
         * @throws {Error} If the update process fails.
         */
        this.updateDateLast = async function ({trx, userRef, ephemeralId}) {
            const trxLocal = trx ?? await conn.startTransaction();
            try {
                if (userRef && ephemeralId) {
                    const dbUser = rdbUser.createDto();
                    dbUser.ephemeral_id = ephemeralId;
                    dbUser.date_last = new Date();
                    dbUser.user_ref = userRef;
                    await updateEntity({trx: trxLocal, dbUser});
                    logger.info(`Last action date updated for OpenAI user with ID: ${dbUser.user_ref}.`);
                    const res = convUser.db2dom({dbUser});
                    if (!trx) await trxLocal.commit();
                    return res;
                } else {
                    logger.info(`Cannot update last action date: Missing userRef or ephemeralId.`);
                    if (!trx) await trxLocal.commit();
                    return null;
                }
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Failed to update last action date for OpenAI user (${userRef}/${ephemeralId}): ${error.message}`);
                throw error;
            }
        };

    }
}
