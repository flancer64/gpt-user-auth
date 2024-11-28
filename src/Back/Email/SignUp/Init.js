/**
 * Operation to send a verification email for user email address verification.
 * Retrieves user data, generates or validates a verification token,
 * and sends a verification email containing a unique link for email verification.
 * Ensures transaction safety and logs the process.
 */

/**
 * @memberOf Fl64_Gpt_User_Back_Email_SignUp_Init
 */
const RESULT_CODES = {
    EMAIL_SEND_FAILED: 'EMAIL_SEND_FAILED',
    SUCCESS: 'SUCCESS',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
};
Object.freeze(RESULT_CODES);

export default class Fl64_Gpt_User_Back_Email_SignUp_Init {
    /**
     * @param {Fl64_Gpt_User_Back_Defaults} DEF
     * @param {TeqFw_Core_Back_Config} config
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {TeqFw_Email_Back_Service_Send} serviceSend
     * @param {Fl64_Gpt_User_Back_Mod_User} modUser
     * @param {Fl64_Gpt_User_Back_Mod_Token} modToken
     * @param {typeof Fl64_Gpt_User_Shared_Enum_Token_Type} TOKEN
     */
    constructor(
        {
            Fl64_Gpt_User_Back_Defaults$: DEF,
            TeqFw_Core_Back_Config$: config,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            TeqFw_Email_Back_Service_Send$: serviceSend,
            Fl64_Gpt_User_Back_Mod_User$: modUser,
            Fl64_Gpt_User_Back_Mod_Token$: modToken,
            'Fl64_Gpt_User_Shared_Enum_Token_Type.default': TOKEN,
        }
    ) {
        // VARS
        const RES_CODES_SEND = serviceSend.getResultCodes();
        let URL_BASE;

        /**
         * Initializes or retrieves the base URL for verification links.
         * This is constructed from the application configuration.
         * @return {string}
         */
        function getBaseUrl() {
            if (!URL_BASE) {
                const web = config.getLocal(DEF.SHARED.MOD_WEB.NAME);
                URL_BASE = `https://${web.urlBase}${DEF.SHARED.ROUTE_VERIFY}`;
            }
            return URL_BASE;
        }

        /**
         * Sends a verification email for a specific user.
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx] - Transaction context for database operations.
         * @param {number} userId - Identifier of the user to process.
         * @param {string} localeApp - Default locale for the application.
         * @returns {Promise<{resultCode: string}>}
         */
        this.execute = async function ({trx, userId, localeApp}) {
            let resultCode = RESULT_CODES.UNKNOWN_ERROR;
            const trxLocal = trx ?? await conn.startTransaction();
            try {
                const user = await modUser.read({trx: trxLocal, userRef: userId});
                if (user) {
                    const vars = await this.prepareVars(trxLocal, user);
                    const success = await this.sendEmail({
                        to: user.email,
                        pkg: DEF.NAME,
                        templateName: DEF.EMAIL_SIGN_UP,
                        vars,
                        locale: user.locale,
                        localeDef: localeApp,
                        localePlugin: DEF.LOCALE,
                    });
                    resultCode = success ? RESULT_CODES.SUCCESS : RESULT_CODES.EMAIL_SEND_FAILED;
                    logger.info(`Verification email sent successfully to user #${userId}`);
                } else {
                    resultCode = RESULT_CODES.USER_NOT_FOUND;
                    logger.info(`User not found: userId=${userId}`);
                }
                if (!trx) await trxLocal.commit();
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Error during email verification for user #${userId}: ${error.message}`);
                throw error;
            }
            return {resultCode};
        };

        /**
         * Prepares variables for email template rendering.
         * @param {TeqFw_Db_Back_RDb_ITrans} trx - Transaction context.
         * @param {Fl64_Gpt_User_Shared_Dto_User.Dto} user - User data.
         * @returns {Promise<{verify_link: string}>}
         */
        this.prepareVars = async function (trx, user) {
            const dto = modToken.composeEntity();
            dto.userRef = user.userRef;
            dto.type = TOKEN.EMAIL_VERIFICATION;
            const dtoToken = await modToken.create({trx, dto});
            const base = getBaseUrl();
            return {verify_link: base.replace(':code', dtoToken.code)};
        };

        /**
         * Sends an email using the email service.
         * @param {object} params - Parameters for email sending.
         * @param {string} params.to - Recipient email address.
         * @param {string} params.pkg - Package name for the template.
         * @param {string} params.templateName - Template name for the email.
         * @param {object} params.vars - Variables for rendering the email.
         * @param {string} params.locale - User locale.
         * @param {string} params.localeDef - Application default locale.
         * @param {string} params.localePlugin - Plugin default locale.
         * @returns {Promise<boolean>} - `true` if the email was sent successfully, `false` otherwise.
         */
        this.sendEmail = async function ({to, pkg, templateName, vars, locale, localeDef, localePlugin}) {
            const {resultCode} = await serviceSend.execute({
                to,
                pkg,
                templateName,
                vars,
                locale,
                localeDef,
                localePlugin,
            });
            return resultCode === RES_CODES_SEND.SUCCESS;
        };

        /**
         * Returns the result codes for the operation.
         * @return {typeof Fl64_Gpt_User_Back_Email_SignUp_Init.RESULT_CODES}
         */
        this.getResultCodes = () => RESULT_CODES;
    }
}
