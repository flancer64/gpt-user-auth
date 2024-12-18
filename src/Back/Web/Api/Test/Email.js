/**
 * Service for sending a message to the user's registered email.
 */
export default class Fl64_Gpt_User_Back_Web_Api_Test_Email {
    /**
     * @param {Fl64_Gpt_User_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {TeqFw_Web_Back_App_Server_Respond} respond
     * @param {Fl64_Gpt_User_Shared_Web_Api_Test_Email} endpoint
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {Fl64_Gpt_User_Back_Util_Log} utilLog
     * @param {Fl64_Gpt_User_Back_Mod_Auth} modAuth
     * @param {Fl64_Gpt_User_Back_Mod_Openai_User} modOaiUser
     * @param {Fl64_Gpt_User_Back_Mod_User} modUser
     * @param {TeqFw_Email_Back_Act_Send} actSend
     */
    constructor(
        {
            Fl64_Gpt_User_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Back_App_Server_Respond$: respond,
            Fl64_Gpt_User_Shared_Web_Api_Test_Email$: endpoint,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            Fl64_Gpt_User_Back_Util_Log$: utilLog,
            Fl64_Gpt_User_Back_Mod_Auth$: modAuth,
            Fl64_Gpt_User_Back_Mod_Openai_User$: modOaiUser,
            Fl64_Gpt_User_Back_Mod_User$: modUser,
            TeqFw_Email_Back_Act_Send$: actSend,
        }
    ) {

        // VARS
        const CODE = endpoint.getResultCodes();

        // MAIN
        /**
         * Returns the endpoint associated with this service.
         * @returns {Fl64_Gpt_User_Shared_Web_Api_Test_Email}
         */
        this.getEndpoint = () => endpoint;

        /**
         * Initializes the service. Add any setup steps here if required.
         * @returns {Promise<void>}
         */
        this.init = async function () {};

        /**
         * Processes the request to send a message to the user's email.
         * @param {Fl64_Gpt_User_Shared_Web_Api_Test_Email.Request} req
         * @param {Fl64_Gpt_User_Shared_Web_Api_Test_Email.Response} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} [context]
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            utilLog.traceOpenAi(context?.request);
            // Ensure the request is authorized
            if (!(await modAuth.isValidRequest(context?.request))) {
                respond.status403(context?.response);
                return;
            }

            const rs = endpoint.createRes();
            let resultCode = CODE.SERVICE_ERROR;

            // Start a transaction for database operations
            const trx = await conn.startTransaction();

            try {
                const authData = modAuth.getContextData(context.request);
                // Retrieve user details by ID or by PIN & password
                const foundUser = (authData?.userId)
                    ? await modUser.read({trx, userRef: authData.userId})
                    : await modAuth.loadUser({trx, pin: req.pin, passPhrase: req.passPhrase});
                if (!foundUser) {
                    // Handle unauthenticated or inactive user
                    resultCode = CODE.UNAUTHENTICATED;
                    rs.message = 'Authentication failed. Ensure your PIN and passphrase are correct, and your account is active.';
                } else {
                    // Prepare email subject and content
                    const emailSubject = req.subject || 'GPT Message'; // Default subject
                    const emailContent = req.message || 'This email was sent without a message body.'; // Default content

                    // Attempt to send the email
                    const emailSent = await actSend.act({
                        to: foundUser.email,
                        subject: emailSubject,
                        text: emailContent,
                    });

                    // Update the last date
                    const ephemeralId = context?.request?.headers[DEF.HTTP_HEAD_OPENAI_EPHEMERAL_USER_ID];
                    await modOaiUser.updateDateLast({trx, userRef: foundUser.userRef, ephemeralId});

                    resultCode = emailSent.success ? CODE.SUCCESS : CODE.SERVICE_ERROR;
                    rs.message = resultCode === CODE.SUCCESS
                        ? 'The email was successfully sent to the user. Check the user\'s registered email for the message.'
                        : 'The email could not be sent due to an internal error. Please try again later.';
                }

                await trx.commit();
            } catch (error) {
                logger.exception(error);
                await trx.rollback();
                rs.message = 'An unexpected error occurred while processing your request. Please try again later.';
            }

            rs.resultCode = resultCode;
            Object.assign(res, rs); // Populate response
        };
    }
}
