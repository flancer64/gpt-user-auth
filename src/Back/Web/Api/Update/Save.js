import {randomUUID} from 'crypto';

/**
 * Handles saving user profile updates.
 *
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Fl64_Gpt_User_Back_Web_Api_Update_Save {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {Fl64_Gpt_User_Shared_Web_Api_Update_Save} endpoint
     * @param {Fl64_Gpt_User_Back_Mod_User} modUser
     * @param {Fl64_Gpt_User_Back_Mod_Token} modToken
     * @param {typeof Fl64_Gpt_User_Shared_Enum_Token_Type} TOKEN_TYPE
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            Fl64_Gpt_User_Shared_Web_Api_Update_Save$: endpoint,
            Fl64_Gpt_User_Back_Mod_User$: modUser,
            Fl64_Gpt_User_Back_Mod_Token$: modToken,
            'Fl64_Gpt_User_Shared_Enum_Token_Type.default': TOKEN_TYPE,
        }
    ) {
        const RES_CODE = endpoint.getResultCodes();

        this.getEndpoint = () => endpoint;

        this.init = async function () {};

        /**
         * Processes the profile update request.
         *
         * @param {Fl64_Gpt_User_Shared_Web_Api_Update_Save.Request} req
         * @param {Fl64_Gpt_User_Shared_Web_Api_Update_Save.Response} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            res.resultCode = RES_CODE.SERVER_ERROR;
            const trx = await conn.startTransaction();
            try {
                const token = req.token;
                if (!token) {
                    res.resultCode = RES_CODE.INVALID_TOKEN;
                } else {
                    const foundToken = await modToken.read({trx, code: token});
                    if (foundToken && foundToken.type === TOKEN_TYPE.PROFILE_EDIT) {
                        const userRef = foundToken.userRef;
                        const foundUser = await modUser.read({trx, userRef});
                        if (req.locale) foundUser.locale = req.locale;
                        if (req.passphrase) {
                            foundUser.passSalt = randomUUID();
                            foundUser.passHash = modUser.hashPassPhrase({
                                passPhrase: req.passphrase,
                                salt: foundUser.passSalt,
                            });
                        }
                        await modUser.update({trx, dto: foundUser});
                        await modToken.delete({trx, dto: foundToken});
                        logger.info(`Token '${token}' deleted after successful profile update for userRef '${userRef}'.`);
                        res.resultCode = RES_CODE.SUCCESS;
                    } else {
                        res.resultCode = RES_CODE.INVALID_TOKEN;
                    }
                }
                await trx.commit();
            } catch (error) {
                logger.exception(error);
                await trx.rollback();
            }
        };
    }
}
