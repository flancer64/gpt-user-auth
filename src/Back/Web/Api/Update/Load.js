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
     * @param {Fl64_Gpt_User_Back_Mod_Token} modToken
     * @param {typeof Fl64_Gpt_User_Shared_Enum_Token_Type} TOKEN_TYPE
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            Fl64_Gpt_User_Shared_Web_Api_Update_Load$: endpoint,
            Fl64_Gpt_User_Back_Mod_User$: modUser,
            Fl64_Gpt_User_Back_Mod_Token$: modToken,
            'Fl64_Gpt_User_Shared_Enum_Token_Type.default': TOKEN_TYPE,
        }
    ) {
        // VARS
        /** @type {typeof Fl64_Gpt_User_Shared_Web_Api_Update_Load.ResultCode} */
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
            const rs = endpoint.createRes();
            rs.resultCode = RES_CODE.SERVER_ERROR;

            const trx = await conn.startTransaction();
            try {
                // Validate token
                const token = req.token;
                if (!token) {
                    rs.resultCode = RES_CODE.INVALID_TOKEN;
                } else {
                    const foundToken = await modToken.read({trx, code: token});
                    if (foundToken && (foundToken.type === TOKEN_TYPE.PROFILE_EDIT)) {
                        const userId = foundToken.userRef;
                        /** @type {Fl64_Gpt_User_Shared_Dto_User.Dto} */
                        const user = await modUser.read({trx, userRef: userId});
                        if (user) {
                            rs.dateCreated = user.dateCreated;
                            rs.email = user.email;
                            rs.locale = user.locale;
                            rs.pin = user.pin;
                            rs.status = user.status;
                            rs.resultCode = RES_CODE.SUCCESS;
                        }
                    } else {
                        rs.resultCode = RES_CODE.INVALID_TOKEN;
                    }
                }

                // Commit the transaction
                await trx.commit();

            } catch (error) {
                await trx.rollback();
                logger.exception(error);
            }
            // Populate response
            Object.assign(res, rs);
        };

    }
}
