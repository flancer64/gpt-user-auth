/**
 * Initialize the profile update process for the user.
 *
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Fl64_Gpt_User_Back_Web_Api_Update_Init {
    /**
     * @param {Fl64_Gpt_User_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {Fl64_Gpt_User_Shared_Web_Api_Update_Init} endpoint
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {TeqFw_Web_Back_App_Server_Respond.respond403|function} respond403
     * @param {Fl64_Gpt_User_Back_Util_Log} utilLog
     * @param {Fl64_Gpt_User_Back_Mod_Auth} modAuth
     * @param {Fl64_Gpt_User_Back_Mod_User} modUser
     * @param {Fl64_Gpt_User_Back_Mod_Openai_User} modOaiUser
     * @param {Fl64_Gpt_User_Back_Email_Update_Init} emailInit
     */
    constructor(
        {
            Fl64_Gpt_User_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Fl64_Gpt_User_Shared_Web_Api_Update_Init$: endpoint,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            'TeqFw_Web_Back_App_Server_Respond.respond403': respond403,
            Fl64_Gpt_User_Back_Util_Log$: utilLog,
            Fl64_Gpt_User_Back_Mod_Auth$: modAuth,
            Fl64_Gpt_User_Back_Mod_User$: modUser,
            Fl64_Gpt_User_Back_Mod_Openai_User$: modOaiUser,
            Fl64_Gpt_User_Back_Email_Update_Init$: emailInit,
        }
    ) {
        // Constants
        const RESULT_CODE = endpoint.getResultCodes();

        // Instance Methods

        /**
         * Retrieve the endpoint definition.
         * @return {Fl64_Gpt_User_Shared_Web_Api_Update_Init}
         */
        this.getEndpoint = () => endpoint;

        /**
         * Initialize the service. Reserved for future use.
         * @return {Promise<void>}
         */
        this.init = async function () {};

        /**
         * Process the request to initialize the profile update process.
         *
         * @param {Fl64_Gpt_User_Shared_Web_Api_Update_Init.Request} req - The incoming request.
         * @param {Fl64_Gpt_User_Shared_Web_Api_Update_Init.Response} res - The outgoing response.
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} [context] - Optional context for the request.
         * @return {Promise<void>}
         */
        this.process = async function (req, res, context) {
            utilLog.traceOpenAi(context?.request);
            // Check for authorization
            if (!modAuth.isValidRequest(context?.request)) {
                respond403(context?.response);
                return;
            }

            const trx = await conn.startTransaction();
            try {
                const {email, pin} = req;
                logger.info(`Starting profile update process for email: ${email ?? 'none'}, PIN: ${pin ?? 'none'}.`);

                /** @type {Fl64_Gpt_User_Shared_Dto_User.Dto} */
                let found = null;

                // Attempt to find the user by email first
                if (email) {
                    found = await modUser.read({trx, email});
                }

                // If email lookup fails, attempt to find by PIN
                if (!found?.userRef && pin) {
                    logger.info(`Email lookup failed. Attempting PIN lookup for PIN: ${pin}.`);
                    found = await modUser.read({trx, pin});
                }

                if (found?.userRef) {
                    // Send email for profile update link asynchronously
                    emailInit
                        .execute({
                            email: found.email,
                            userId: found.userRef,
                        })
                        .catch(logger.exception);

                    // Update the last date
                    const ephemeralId = context?.request?.headers[DEF.HTTP_HEAD_OPENAI_EPHEMERAL_USER_ID];
                    await modOaiUser.updateDateLast({trx, userRef: found.userRef, ephemeralId});


                    logger.info(`Profile update link sent to user with ID: ${found.userRef}.`);
                } else {
                    logger.info(`No user found for email: ${email ?? 'none'} and PIN: ${pin ?? 'none'}.`);
                }

                await trx.commit();

                res.instructions = 'If the user provided valid credentials, a link to update the profile has been sent to their email.';
                res.resultCode = RESULT_CODE.SUCCESS;
            } catch (error) {
                logger.exception(error);
                await trx.rollback();

                res.instructions = 'An unexpected error occurred. Please try again later.';
                res.resultCode = RESULT_CODE.SERVER_ERROR;
            }
        };
    }
}
