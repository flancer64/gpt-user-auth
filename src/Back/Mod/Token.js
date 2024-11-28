import {randomUUID} from 'crypto';

/**
 * Model for managing OpenAI Token data in the RDB.
 *
 * @implements TeqFw_Core_Shared_Api_Model
 */
export default class Fl64_Gpt_User_Back_Mod_Token {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger - instance
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
     * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_Token} rdbToken
     * @param {Fl64_Gpt_User_Shared_Dto_Token} dtoToken
     * @param {Fl64_Gpt_User_Back_Convert_Token} convToken
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
            Fl64_Gpt_User_Back_Store_RDb_Schema_Token$: rdbToken,
            Fl64_Gpt_User_Shared_Dto_Token$: dtoToken,
            Fl64_Gpt_User_Back_Convert_Token$: convToken,
        }
    ) {
        // VARS
        const ATTR = rdbToken.getAttributes();

        // FUNCS

        /**
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_Token.Dto} dbToken
         * @return {Promise<void>}
         */
        async function create(trx, dbToken) {
            await crud.create(trx, rdbToken, dbToken);
        }

        /**
         * Deletes a token record by its code.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {string} code
         * @return {Promise<number>}
         */
        async function del(trx, code) {
            return await crud.deleteOne(trx, rdbToken, {[ATTR.CODE]: code});
        }

        /**
         * Reads a token from the database by its code.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {string} code - The code of the token to retrieve.
         * @return {Promise<Fl64_Gpt_User_Back_Store_RDb_Schema_Token.Dto|null>}
         */
        async function read(trx, code) {
            return await crud.readOne(trx, rdbToken, {[ATTR.CODE]: code});
        }

        // MAIN

        /**
         * @type {function(Fl64_Gpt_User_Shared_Dto_Token.Dto=): Fl64_Gpt_User_Shared_Dto_Token.Dto}
         */
        this.composeEntity = dtoToken.createDto;

        /**
         * @type {function(Fl64_Gpt_User_Shared_Dto_Token.Dto=): Fl64_Gpt_User_Shared_Dto_Token.Dto}
         */
        this.composeItem = dtoToken.createDto;

        /**
         * Creates a new token entry in the RDB.
         *
         * @param {Object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx]
         * @param {Fl64_Gpt_User_Shared_Dto_Token.Dto} params.dto
         * @returns {Promise<Fl64_Gpt_User_Shared_Dto_Token.Dto>}
         */
        this.create = async function ({trx, dto}) {
            const trxLocal = trx ?? await conn.startTransaction();
            let result;
            try {
                const {dbToken} = convToken.dom2db({token: dto});
                dbToken.code = randomUUID();
                await create(trxLocal, dbToken);

                const created = await read(trxLocal, dbToken.code);
                result = convToken.db2dom({dbToken: created});
                logger.info(`Token entry created successfully with code: ${result.code}.`);
                if (!trx) await trxLocal.commit();
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Error creating token entry with code: ${dto.code}: ${error.message}`);
                throw error;
            }
            return result;
        };

        /**
         * Deletes a token record from the database.
         *
         * @param {Object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx]
         * @param {Fl64_Gpt_User_Shared_Dto_Token.Dto} params.dto
         * @returns {Promise<number>}
         */
        this.delete = async function ({trx, dto}) {
            const trxLocal = trx ?? await conn.startTransaction();
            let result;
            try {
                result = await del(trxLocal, dto.code);
                logger.info(`Token entry deleted successfully with code: ${dto.code}.`);
                if (!trx) await trxLocal.commit();
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Error deleting token entry with code: ${dto.code}: ${error.message}`);
                throw error;
            }
            return result;
        };


        /**
         * Retrieves all token entries from the database as domain DTOs.
         *
         * @param {Object} [params]
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx] - Optional transaction context.
         * @returns {Promise<Fl64_Gpt_User_Shared_Dto_Token.Dto[]>}
         * @throws {Error}
         */
        this.list = async function ({trx} = {}) {
            const trxLocal = trx ?? await conn.startTransaction();
            const result = [];
            try {
                const all = await crud.readSet(trxLocal, rdbToken);
                for (const one of all) {
                    result.push(convToken.db2dom({dbToken: one}));
                }
                if (!trx) await trxLocal.commit();
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                throw error;
            }
            return result;
        };


        /**
         * Reads token data by token code.
         *
         * @param {Object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx]
         * @param {string} params.code - The code of the token to be retrieved.
         * @returns {Promise<Fl64_Gpt_User_Shared_Dto_Token.Dto|null>}
         */
        this.read = async function ({trx, code}) {
            const trxLocal = trx ?? await conn.startTransaction();
            let result = null;

            try {
                if (!code) {
                    logger.error('Cannot find token entry without a code.');
                } else {
                    const found = await read(trxLocal, code);
                    if (found) {
                        result = convToken.db2dom({dbToken: found});
                        logger.info(`Token entry read successfully with code: ${code}.`);
                    } else {
                        logger.info(`Token entry not found for code: ${code}.`);
                    }
                }
                if (!trx) await trxLocal.commit();
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Error reading token entry with code: ${code}: ${error.message}`);
                throw error;
            }
            return result;
        };

        /**
         * Throws an error when attempting to update a token entry.
         *
         * @returns {Promise<Fl64_Gpt_User_Shared_Dto_Token.Dto|null>}
         */
        this.update = async function ({}) {
            throw new Error('Updating a token is not allowed. Please delete the existing token and create a new one.');
        };
    }
}
