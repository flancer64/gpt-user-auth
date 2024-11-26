/**
 * Update the user profile data in the backend.
 */

// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Fl64_Gpt_User_Back_Web_Api_Update_Save {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger - instance
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
        // VARS
        const RES_CODE = endpoint.getResultCodes();

        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         * @param {Fl64_Gpt_User_Shared_Web_Api_Update_Save.Request} req
         * @param {Fl64_Gpt_User_Shared_Web_Api_Update_Save.Response} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            const rs = endpoint.createRes();
            rs.resultCode = RES_CODE.SERVER_ERROR
            ;
            const trx = await conn.startTransaction();
            try {
                // Validate token
                const token = req.token;
                if (!token) {
                    rs.resultCode = RES_CODE.INVALID_TOKEN;
                } else {
                    const foundToken = await modToken.read({trx, code: token});
                    if (foundToken && foundToken.type === TOKEN_TYPE.PROFILE_EDIT) {
                        const userId = foundToken.userRef;
                        // TODO: save updates
                        if (req.passphrase) {
                            // We can update just the passphrase in this case
                            await modUser.updatePass({
                                trx,
                                passPhrase: req.passphrase,
                                userRef: userId,
                            });
                        }
                        rs.resultCode = RES_CODE.SUCCESS;
                        await modToken.delete({trx, dto: foundToken});
                        logger.info(`Token '${token}' was deleted.`);
                    } else {
                        rs.resultCode = RES_CODE.INVALID_TOKEN;
                    }
                }
                // Commit the transaction
                await trx.commit();
            } catch (error) {
                logger.exception(error);
                await trx.rollback();
            }
            // Populate response
            Object.assign(res, rs);
        };
    }
}
