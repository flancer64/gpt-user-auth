/**
 * Initialize the profile update process for the user.
 *
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Fl64_Gpt_User_Back_Web_Api_Update_Init {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {Fl64_Gpt_User_Shared_Web_Api_Update_Init} endpoint
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {TeqFw_Web_Back_App_Server_Respond.respond403|function} respond403
     * @param {Fl64_Gpt_User_Back_Mod_Auth} modAuth
     * @param {Fl64_Gpt_User_Back_Mod_User} modUser
     * @param {Fl64_Gpt_User_Back_Email_Update_Init} emailInit
     */
    constructor({
                    TeqFw_Core_Shared_Api_Logger$$: logger,
                    Fl64_Gpt_User_Shared_Web_Api_Update_Init$: endpoint,
                    TeqFw_Db_Back_RDb_IConnect$: conn,
                    'TeqFw_Web_Back_App_Server_Respond.respond403': respond403,
                    Fl64_Gpt_User_Back_Mod_Auth$: modAuth,
                    Fl64_Gpt_User_Back_Mod_User$: modUser,
                    Fl64_Gpt_User_Back_Email_Update_Init$: emailInit,
                }) {
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
            // Check for authorization
            if (!modAuth.hasBearerInRequest(context?.request)) {
                respond403(context?.response);
                return;
            }

            const trx = await conn.startTransaction();
            try {
                // Validate input PIN or email
                const pin = req.pin;
                const email = req.email;
                logger.info(`Starting profile update with PIN/email: ${pin ?? 'none'}/${email ?? 'none'}.`);

                const found = await modUser.read({trx, pin, email});
                if (found?.userRef) {
                    // Asynchronously send email to the user
                    emailInit
                        .execute({
                            email: found.email,
                            userId: found.userRef,
                        })
                        .catch(logger.exception);
                } else {
                    logger.info(`No user found for PIN/email: ${pin ?? 'none'}/${email ?? 'none'}.`);
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
