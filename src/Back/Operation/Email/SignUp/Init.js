/**
 * Operation to send a verification email for user email address verification.
 * This operation retrieves user data, generates or validates a verification token,
 * and sends a verification email containing a unique link for email verification.
 * The operation ensures transaction safety and logs the process.
 */

/**
 * @memberOf Fl64_Gpt_User_Back_Operation_Email_SignUp_Init
 */
const ResultCodes = {
    EMAIL_SEND_FAILED: 'EMAIL_SEND_FAILED',
    SUCCESS: 'SUCCESS',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
};
Object.freeze(ResultCodes);

export default class Fl64_Gpt_User_Back_Operation_Email_SignUp_Init {
    /**
     * @param {Fl64_Gpt_User_Back_Defaults} DEF
     * @param {TeqFw_Core_Back_Config} config
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {TeqFw_Email_Back_Act_Send} actSend
     * @param {Fl64_Gpt_User_Back_Mod_App_Email_Loader} emailLoader
     * @param {Fl64_Gpt_User_Back_Mod_User} modUserGpt
     * @param {Fl64_Gpt_User_Back_Mod_Fl32_Bot_Gpt_Token} modToken
     * @param {typeof Fl64_Gpt_User_Shared_Enum_Token_Type} TOKEN
     */
    constructor(
        {
            Fl64_Gpt_User_Back_Defaults$: DEF,
            TeqFw_Core_Back_Config$: config,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            TeqFw_Email_Back_Act_Send$: actSend,
            Fl64_Gpt_User_Back_Mod_App_Email_Loader$: emailLoader,
            Fl64_Gpt_User_Back_Mod_User$: modUserGpt,
            Fl64_Gpt_User_Back_Mod_Fl32_Bot_Gpt_Token$: modToken,
            'Fl64_Gpt_User_Shared_Enum_Token_Type.default': TOKEN,
        }
    ) {
        // BASE URL for verification links
        let URL_BASE;

        // FUNCTIONS
        /**
         * Initializes the base URL for verification links from configuration.
         * @return {string}
         */
        function getBaseUrl() {
            if (!URL_BASE) {
                /** @type {TeqFw_Web_Back_Plugin_Dto_Config_Local.Dto} */
                const web = config.getLocal(DEF.SHARED.MOD_WEB.NAME);
                URL_BASE = `https://${web.urlBase}${DEF.SHARED.ROUTE_VERIFY}`;
            }
            return URL_BASE;
        }

        /**
         * Sends an email containing the verification link.
         * @param {string} to - Recipient's email address.
         * @param {string} code - Verification code to include in the link.
         * @return {Promise<{success: boolean}>}
         */
        async function sendEmail(to, code) {
            const base = getBaseUrl();
            const verify_link = base.replace(':code', code);
            const {subject, text, html} = await emailLoader.execute({
                templateName: 'Gpt_SignUp_Init',
                vars: {verify_link}
            });
            const {success} = await actSend.act({to, subject, text, html});
            if (success) {
                logger.info(`Verification email successfully sent to '${to}'.`);
            } else {
                logger.error(`Failed to send verification email to '${to}'.`);
            }
            return {success};
        }

        // MAIN EXECUTION
        /**
         * Executes the operation to send a verification email.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx] - Optional external transaction.
         * @param {number} userId - Internal user ID to process.
         * @param {string} [token] - Existing token code, if already created.
         * @param {string} [tokenType] - Token type if new token should be generated.
         * @returns {Promise<{resultCode: string}>}
         */
        this.execute = async function ({trx, userId, token, tokenType}) {
            let resultCode = ResultCodes.UNKNOWN_ERROR;
            const trxLocal = trx ?? await conn.startTransaction();
            try {
                // Read user data to get the email address
                const user = await modUserGpt.read({trx: trxLocal, userRef: userId});
                if (user) {
                    // Attempt to read an existing token by its code
                    let dtoToken = null;
                    if (token) {
                        dtoToken = await modToken.read({trx: trxLocal, code: token});
                    }

                    // If no existing token is found, create a new one
                    if (!dtoToken) {
                        const dto = modToken.composeEntity();
                        dto.userRef = userId;
                        dto.type = tokenType ?? TOKEN.EMAIL_VERIFICATION;
                        dtoToken = await modToken.create({trx: trxLocal, dto});
                    }

                    // Send the verification email
                    const {success} = await sendEmail(user.email, dtoToken.code);
                    resultCode = success ? ResultCodes.SUCCESS : ResultCodes.EMAIL_SEND_FAILED;
                } else {
                    resultCode = ResultCodes.USER_NOT_FOUND;
                    logger.error(`User not found for userId: ${userId}`);
                }

                if (!trx) await trxLocal.commit();
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Failed to process email verification for user ${userId}: ${error.message}`);
                throw error;
            }
            return {resultCode};
        };

        /**
         * @return {typeof Fl64_Gpt_User_Back_Operation_Email_SignUp_Init.ResultCodes}
         */
        this.getResultCodes = () => ResultCodes;
    }
}
