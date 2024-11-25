/**
 * Verify the user's email during sign-up.
 */
// CLASSES
/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Fl64_Gpt_User_Back_Web_Api_SignUp_Verify {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger - instance
     * @param {Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify} endpoint
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {Fl64_Gpt_User_Back_Mod_User} modUser
     * @param {Fl64_Gpt_User_Back_Mod_Token} modToken
     * @param {typeof Fl64_Gpt_User_Shared_Enum_User_Status} STATUS
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify$: endpoint,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            Fl64_Gpt_User_Back_Mod_User$: modUser,
            Fl64_Gpt_User_Back_Mod_Token$: modToken,
            'Fl64_Gpt_User_Shared_Enum_User_Status.default': STATUS,
        }
    ) {
        // VARS
        const RESULT_CODE = endpoint.getResultCodes();

        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         * @param {Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify.Request} req
         * @param {Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify.Response} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} [context]
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            // FUNCS
            // MAIN
            const rs = endpoint.createRes();
            const trx = await conn.startTransaction();
            try {
                const code = req.token;

                // Find the verification record by token
                const dtoToken = await modToken.read({trx, code});
                if (!dtoToken) {
                    rs.resultCode = RESULT_CODE.INVALID_TOKEN;
                } else {
                    // Retrieve associated user
                    const dtoUser = await modUser.read({trx, userRef: dtoToken.userRef});
                    if (dtoUser) {
                        // Update user status to confirmed
                        if (dtoUser.status === STATUS.UNVERIFIED) {
                            dtoUser.status = STATUS.ACTIVE;
                            await modUser.update({trx, dto: dtoUser});
                        }
                        // Delete the verification token after successful verification
                        await modToken.delete({trx, dto: dtoToken});

                        // Populate response with user profile data
                        rs.dateCreated = dtoUser.dateCreated;
                        rs.email = dtoUser.email;
                        rs.locale = dtoUser.locale;
                        rs.pin = dtoUser.pin;
                        rs.resultCode = RESULT_CODE.SUCCESS;
                        rs.status = dtoUser.status;
                    } else {
                        rs.resultCode = RESULT_CODE.USER_NOT_FOUND;
                    }
                }
                // Commit the transaction
                await trx.commit();
                // Populate response
                Object.assign(res, rs);
                logger.info(`result code: ${res.resultCode}`);
            } catch (error) {
                logger.exception(error);
                await trx.rollback();
            }
        };
    }
}
