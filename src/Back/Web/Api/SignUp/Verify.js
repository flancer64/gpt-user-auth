/**
 * Verify the user's email during sign-up.
 */
// CLASSES
/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class GptAct_Back_Web_Api_Gpt_User_SignUp_Verify {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger - instance
     * @param {GptAct_Shared_Web_Api_Gpt_User_SignUp_Verify} endpoint
     * @param {typeof GptAct_Shared_Web_Api_Gpt_User_SignUp_Verify.ResultCode} RESULT_CODE
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {GptAct_Back_Mod_Fl32_Bot_Gpt_User} modUser
     * @param {GptAct_Back_Mod_Fl32_Bot_Gpt_Token} modVerification
     * @param {typeof GptAct_Shared_Enum_OpenAI_User_Status} STATUS
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            GptAct_Shared_Web_Api_Gpt_User_SignUp_Verify$: endpoint,
            'GptAct_Shared_Web_Api_Gpt_User_SignUp_Verify.ResultCode': RESULT_CODE,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            GptAct_Back_Mod_Fl32_Bot_Gpt_User$: modUser,
            GptAct_Back_Mod_Fl32_Bot_Gpt_Token$: modVerification,
            'GptAct_Shared_Enum_OpenAI_User_Status.default': STATUS,
        }
    ) {

        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         * @param {GptAct_Shared_Web_Api_Gpt_User_SignUp_Verify.Request} req
         * @param {GptAct_Shared_Web_Api_Gpt_User_SignUp_Verify.Response} res
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
                const dtoVerification = await modVerification.read({trx, code});
                if (!dtoVerification) {
                    rs.message = `Invalid or expired verification token.`;
                    rs.resultCode = RESULT_CODE.INVALID_TOKEN;
                    logger.info(rs.message);
                } else {
                    // Retrieve associated user
                    const dtoUser = await modUser.read({trx, userRef: dtoVerification.userRef});
                    if (dtoUser) {
                        // Update user status to confirmed
                        if (dtoUser.status === STATUS.UNVERIFIED) {
                            dtoUser.status = STATUS.ACTIVE;
                            await modUser.update({trx, dto: dtoUser});
                        }
                        // Delete the verification token after successful verification
                        // TODO: remove the comment
                        //await modVerification.delete({trx, dto: dtoVerification});

                        // Populate response with user profile data
                        rs.message = `Email verified successfully.`;
                        rs.email = dtoUser.email;
                        rs.dateCreated = dtoUser.dateCreated;
                        rs.pin = dtoUser.pin;
                        rs.status = dtoUser.status;
                        rs.resultCode = RESULT_CODE.SUCCESS;
                    } else {
                        rs.message = `User associated with the token was not found.`;
                        rs.resultCode = RESULT_CODE.USER_NOT_FOUND;
                    }
                }
                // Commit the transaction
                await trx.commit();
                // Populate response
                Object.assign(res, rs);
            } catch (error) {
                logger.exception(error);
                await trx.rollback();
            }
        };
    }
}
