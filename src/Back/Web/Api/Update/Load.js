/**
 * Read the user profile data from the backend.
 */

// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Fl64_Gpt_User_Back_Web_Api_Update_Load {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger - instance
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {Fl64_Gpt_User_Shared_Web_Api_Update_Load} endpoint
     * @param {Fl64_Gpt_User_Back_Mod_User} modUser
     * @param {Fl64_Otp_Back_Mod_Token} modToken
     * @param {typeof Fl64_Gpt_User_Shared_Enum_Token_Type} TOKEN_TYPE
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            Fl64_Gpt_User_Shared_Web_Api_Update_Load$: endpoint,
            Fl64_Gpt_User_Back_Mod_User$: modUser,
            Fl64_Otp_Back_Mod_Token$: modToken,
            'Fl64_Gpt_User_Shared_Enum_Token_Type.default': TOKEN_TYPE,
        }
    ) {
        // VARS
        const RES_CODE = endpoint.getResultCodes();

        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         * @param {Fl64_Gpt_User_Shared_Web_Api_Update_Load.Request} req
         * @param {Fl64_Gpt_User_Shared_Web_Api_Update_Load.Response} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            res.resultCode = RES_CODE.SERVER_ERROR;

            const trx = await conn.startTransaction();
            try {
                // Validate token
                const token = req.token;
                if (!token) {
                    res.resultCode = RES_CODE.INVALID_TOKEN;
                } else {
                    const {dto:foundToken} = await modToken.read({trx,   token});
                    if (foundToken && (foundToken.type === TOKEN_TYPE.PROFILE_EDIT)) {
                        const userId = foundToken.user_ref;
                        /** @type {Fl64_Gpt_User_Shared_Dto_User.Dto} */
                        const user = await modUser.read({trx, userRef: userId});
                        if (user) {
                            res.dateCreated = user.dateCreated;
                            res.email = user.email;
                            res.locale = user.locale;
                            res.pin = user.pin;
                            res.status = user.status;
                            res.resultCode = RES_CODE.SUCCESS;
                        }
                    } else {
                        res.resultCode = RES_CODE.INVALID_TOKEN;
                    }
                }
                await trx.commit();
            } catch (error) {
                await trx.rollback();
                logger.exception(error);
            }
        };
    }
}
