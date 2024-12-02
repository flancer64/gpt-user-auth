/**
 * Model for managing OpenAI User data in the RDB.
 *
 * @implements TeqFw_Core_Shared_Api_Model
 */
export default class Fl64_Gpt_User_Back_Mod_Openai_User {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger - instance
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
         * Executes the creation of a new OpenAI user in the database.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx - The transaction context.
         * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_Openai_User.Dto} dbUser - The user DTO containing data for the new record.
         * @returns {Promise<{id:number}>} - The ID of the newly created user record.
         */
        async function createEntity({trx, dbUser}) {
            await crud.create(trx, rdbUser, dbUser);
            return {id: dbUser.user_ref};
        }

        /**
         * Deletes an OpenAI user from the database.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_Openai_User.Dto} [dbUser]
         * @returns {Promise<number>} - Number of deleted records
         */
        async function deleteEntity({trx, dbUser}) {
            return await crud.deleteOne(trx, rdbUser, {[ATTR.USER_REF]: dbUser.user_ref});
        }

        /**
         * Reads an OpenAI user from the database by key.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {number} [userRef]
         * @param {string} [code]
         * @returns {Promise<{dbUser:Fl64_Gpt_User_Back_Store_RDb_Schema_Openai_User.Dto}>} - Object containing the user data or an empty object if not found.
         */
        async function readEntity({trx, userRef, code}) {
            let dbUser;
            let key = null;

            if (userRef !== undefined) {
                key = userRef;
            } else if (code !== undefined) {
                key = {[ATTR.CODE]: code};
            }
            if (key) dbUser = await crud.readOne(trx, rdbUser, key);
            return {dbUser};
        }

        // MAIN

        /**
         * @type {function(Fl64_Gpt_User_Shared_Dto_Openai_User.Dto=): Fl64_Gpt_User_Shared_Dto_Openai_User.Dto}
         */
        this.composeEntity = dtoUser.createDto;

        /**
         * @type {function(Fl64_Gpt_User_Shared_Dto_Openai_User.Dto=): Fl64_Gpt_User_Shared_Dto_Openai_User.Dto}
         */
        this.composeItem = dtoUser.createDto;

        /**
         * Creates a new OpenAI user in the RDB.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx]
         * @param {Fl64_Gpt_User_Shared_Dto_Openai_User.Dto} dto
         * @returns {Promise<Fl64_Gpt_User_Shared_Dto_Openai_User.Dto>}
         */
        this.create = async function ({trx, dto}) {
            const trxLocal = trx ?? await conn.startTransaction();
            try {
                const {dbUser} = convUser.dom2db({user: dto});
                const {id} = await createEntity({trx: trxLocal, dbUser});

                const {dbUser: createdUser} = await readEntity({trx: trxLocal, userRef: id});
                const res = convUser.db2dom({dbUser: createdUser});
                if (!trx) await trxLocal.commit();
                logger.info(`OpenAI user data for user #${createdUser.user_ref} has been created successfully.`);
                return res;
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Error creating OpenAI user: ${error.message}`);
                throw error;
            }
        };

        /**
         * Deletes an OpenAI user record from the database.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx]
         * @param {Fl64_Gpt_User_Shared_Dto_Openai_User.Dto} dto
         * @returns {Promise<number>}
         */
        this.delete = async function ({trx, dto}) {
            const trxLocal = trx ?? await conn.startTransaction();
            try {
                const {dbUser} = convUser.dom2db({user: dto});
                const res = await deleteEntity({trx: trxLocal, dbUser});
                if (!trx) await trxLocal.commit();
                logger.info(`OpenAI user deleted successfully with ID: ${dbUser.user_ref}`);
                return res;
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Error deleting OpenAI user: ${error.message}`);
                throw error;
            }
        };

        /**
         * Reads OpenAI user data by user reference or code.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx]
         * @param {number} [userRef]
         * @param {string} [code]
         * @returns {Promise<Fl64_Gpt_User_Shared_Dto_Openai_User.Dto|null>}
         */
        this.read = async function ({trx, userRef, code}) {
            const trxLocal = trx ?? await conn.startTransaction();
            let result = null;

            try {
                const {dbUser} = await readEntity({trx: trxLocal, userRef, code});
                if (dbUser) {
                    result = convUser.db2dom({dbUser});
                    logger.info(`OpenAI user read successfully with ID: ${result.userRef}`);
                } else {
                    logger.info(`OpenAI user with given keys (id/code: ${userRef ?? ''}/${code ?? ''}) is not found.`);
                }
                if (!trx) await trxLocal.commit();
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Error reading OpenAI user: ${error.message}`);
                throw error;
            }

            return result;
        };
    }
}
