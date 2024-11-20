import {createHash, randomInt} from 'crypto';

// FUNCS
/**
 * @param {string} email
 * @return {string|null}
 */
function normEmail(email) {
    return (typeof email === 'string') ? email.trim().toLowerCase() : null;
}

/**
 * Model for managing OpenAI User data in the RDB.
 *
 * @implements TeqFw_Core_Shared_Api_Model
 */
export default class Fl64_Gpt_User_Back_Mod_User {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger - instance
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {Fl64_Gpt_User_Shared_Dto_User} dtoUser
     * @param {Fl64_Gpt_User_Back_Convert_User} convUser
     * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
     * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_User} rdbUser
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            Fl64_Gpt_User_Shared_Dto_User$: dtoUser,
            Fl64_Gpt_User_Back_Convert_User$: convUser,
            TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
            Fl64_Gpt_User_Back_Store_RDb_Schema_User$: rdbUser,
        }
    ) {
        // VARS
        const ATTR = rdbUser.getAttributes();

        // FUNCS

        /**
         * Executes the creation of a new user in the database.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx - The transaction context.
         * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_User.Dto} dbUser - The user DTO containing data for the new record.
         * @returns {Promise<{id:number}>} - The ID of the newly created user record.
         */
        async function createEntity({trx, dbUser}) {
            await crud.create(trx, rdbUser, dbUser);
            return {id: dbUser.user_ref};
        }

        /**
         * Deletes a user from the database.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_User.Dto} [dbUser]
         * @returns {Promise<number>} - Number of deleted records
         */
        async function deleteEntity({trx, dbUser}) {
            return await crud.deleteOne(trx, rdbUser, {[ATTR.USER_REF]: dbUser.user_ref});
        }

        /**
         * Reads a user from the database by key.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {number} [userRef]
         * @param {string} [email]
         * @param {number} [pin]
         * @returns {Promise<{dbUser:Fl64_Gpt_User_Back_Store_RDb_Schema_User.Dto}>} - Object containing the user data or an empty object if not found.
         */
        async function readEntity({trx, userRef, email, pin}) {
            let dbUser;
            let key = null;

            if (userRef !== undefined) {
                key = userRef;
            } else if (pin !== undefined) {
                key = {[ATTR.PIN]: pin};
            } else if (email !== undefined) {
                key = {[ATTR.EMAIL]: email};
            }
            if (key) dbUser = await crud.readOne(trx, rdbUser, key);
            return {dbUser};
        }

        /**
         * Updates a user record in the database.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_User.Dto} dbUser
         * @returns {Promise<void>}
         */
        async function updateEntity({trx, dbUser}) {
            await crud.updateOne(trx, rdbUser, dbUser);
        }

        // MAIN

        /**
         * @type {function(Fl64_Gpt_User_Shared_Dto_User.Dto=): Fl64_Gpt_User_Shared_Dto_User.Dto}
         */
        this.composeEntity = dtoUser.createDto;

        /**
         * @type {function(Fl64_Gpt_User_Shared_Dto_User.Dto=): Fl64_Gpt_User_Shared_Dto_User.Dto}
         */
        this.composeItem = dtoUser.createDto;

        /**
         * Creates a new user in the RDB.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx]
         * @param {Fl64_Gpt_User_Shared_Dto_User.Dto} dto
         * @returns {Promise<Fl64_Gpt_User_Shared_Dto_User.Dto>}
         */
        this.create = async function ({trx, dto}) {
            // FUNCS

            /**
             * Generate unique 4-digit PIN.
             * @param trx
             * @return {Promise<number>}
             */
            async function generatePin(trx) {
                let pin;
                let isUnique = false;

                while (!isUnique) {
                    // TODO: variable length for the PIN
                    pin = randomInt(1000, 10000); // 4-digit PIN
                    const {dbUser} = await readEntity({trx, pin});
                    if (!dbUser) {
                        isUnique = true;
                    }
                }
                return pin;
            }

            // MAIN
            const trxLocal = trx ?? await conn.startTransaction();
            try {
                const {dbUser} = convUser.dom2db({user: dto});
                dbUser.pin = await generatePin(trxLocal);
                const {id} = await createEntity({trx: trxLocal, dbUser});

                const {dbUser: createdUser} = await readEntity({trx: trxLocal, userRef: id});
                const res = convUser.db2dom({dbUser: createdUser});
                if (!trx) await trxLocal.commit();
                logger.info(`Bot authentication data for user #${createdUser.user_ref} has been created successfully.`);
                return res;
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Error creating user: ${error.message}`);
                throw error;
            }
        };

        /**
         * Deletes a user record from the database.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx]
         * @param {Fl64_Gpt_User_Shared_Dto_User.Dto} dto
         * @returns {Promise<number>}
         */
        this.delete = async function ({trx, dto}) {
            const trxLocal = trx ?? await conn.startTransaction();
            try {
                const {dbUser} = convUser.dom2db({user: dto});
                const res = await deleteEntity({trx: trxLocal, dbUser});
                if (!trx) await trxLocal.commit();
                logger.info(`User deleted successfully with ID: ${dbUser.user_ref}`);
                return res;
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Error deleting user: ${error.message}`);
                throw error;
            }
        };

        /**
         * Hashes the passphrase using SHA-256.
         *
         * @param {string} passPhrase - The passphrase to hash.
         * @param {string} salt - A unique salt for the passphrase.
         * @returns {string} - The resulting hashed passphrase.
         */
        this.hashPassPhrase = function ({passPhrase, salt}) {
            // Normalize passphrase: trim and convert to lowercase
            const normalizedPassPhrase = passPhrase.trim().toLowerCase();
            return createHash('sha256').update(normalizedPassPhrase + salt).digest('hex');
        };

        /**
         * Reads user data by user reference.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx]
         * @param {number} [userRef]
         * @param {string} [email]
         * @param {number} [pin]
         * @returns {Promise<Fl64_Gpt_User_Shared_Dto_User.Dto|null>}
         */
        this.read = async function ({trx, userRef, email, pin}) {
            const trxLocal = trx ?? await conn.startTransaction();
            let result = null;

            try {
                if (userRef || email || pin) {
                    const emailNorm = normEmail(email);
                    const {dbUser} = await readEntity({trx: trxLocal, userRef, email: emailNorm, pin});
                    if (dbUser) {
                        result = convUser.db2dom({dbUser});
                        logger.info(`User read successfully with ID: ${result.userRef}`);
                    } else {
                        logger.info(`User with given keys (id/pin/email: ${userRef ?? ''}/${pin ?? ''}/${email ?? ''}) is not found.`);
                    }
                }
                if (!trx) await trxLocal.commit();
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Error reading user: ${error.message}`);
                throw error;
            }

            return result;
        };

        /**
         * Updates user data in the RDB.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx]
         * @param {Fl64_Gpt_User_Shared_Dto_User.Dto} dto
         * @returns {Promise<Fl64_Gpt_User_Shared_Dto_User.Dto|null>}
         */
        this.update = async function ({trx, dto}) {
            const trxLocal = trx ?? await conn.startTransaction();
            try {
                const {dbUser} = await readEntity({trx: trxLocal, userRef: dto.userRef});
                if (dbUser) {
                    dbUser.email = dto.email;
                    dbUser.pass_hash = dto.passHash;
                    dbUser.status = dto.status;
                    await updateEntity({trx: trxLocal, dbUser});
                    logger.info(`User updated successfully with ID: ${dbUser.user_ref}`);
                    const res = convUser.db2dom({dbUser});
                    if (!trx) await trxLocal.commit();
                    return res;
                } else {
                    logger.info(`User not found with ID: ${dto.userRef}`);
                    if (!trx) await trxLocal.commit();
                    return null;
                }
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Error updating user: ${error.message}`);
                throw error;
            }
        };

        /**
         * Updates the pass phrase for a specified user.
         *
         * This method hashes the provided pass phrase with the user's salt and updates
         * the database. If the user is not found or the pass phrase is invalid, the method
         * logs an appropriate message and returns `null`.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx] - Optional external transaction. If not provided, a new transaction is created.
         * @param {number} userRef - The internal reference ID of the user.
         * @param {string} passPhrase - The new pass phrase to be hashed and stored.
         * @returns {Promise< Fl64_Gpt_User_Shared_Dto_User.Dto>} The updated user data in domain model format, or `null` if the operation fails.
         * @throws Will throw an error if the operation encounters an unexpected issue.
         */
        this.updatePass = async function ({trx, userRef, passPhrase}) {
            const trxLocal = trx ?? await conn.startTransaction();
            let result;
            try {
                const {dbUser} = await readEntity({trx: trxLocal, userRef});
                if (dbUser && passPhrase) {
                    dbUser.pass_hash = this.hashPassPhrase({passPhrase, salt: dbUser.pass_salt});
                    await updateEntity({trx: trxLocal, dbUser});
                    logger.info(`Pass phrase for user ${dbUser.user_ref} updated successfully.`);
                    result = convUser.db2dom({dbUser});
                } else {
                    logger.info(`User not found or invalid pass phrase for ID: ${userRef}`);
                }
                if (!trx) await trxLocal.commit();
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Error updating passphrase for user ${userRef}: ${error.message}`);
                throw error;
            }
            return result;
        };
    }
}
