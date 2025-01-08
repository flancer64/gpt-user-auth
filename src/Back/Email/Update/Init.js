/**
 * Operation to send a profile update email containing a unique link.
 * Retrieves user data, generates or validates a profile edit token,
 * and sends an email with a link to update user profile information.
 * Ensures transaction safety and logs the process.
 */

/**
 * @memberOf Fl64_Gpt_User_Back_Email_Update_Init
 */
const RESULT_CODES = {
    EMAIL_SEND_FAILED: 'EMAIL_SEND_FAILED',
    SUCCESS: 'SUCCESS',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
};
Object.freeze(RESULT_CODES);

export default class Fl64_Gpt_User_Back_Email_Update_Init {
    /**
     * @param {Fl64_Gpt_User_Back_Defaults} DEF - Default configuration values.
     * @param {TeqFw_Core_Back_Config} config - Application configuration.
     * @param {TeqFw_Core_Shared_Api_Logger} logger - Logger instance for logging actions and errors.
     * @param {TeqFw_Db_Back_RDb_IConnect} conn - Database connection interface.
     * @param {TeqFw_Email_Back_Service_Send} serviceSend - Email service for sending messages.
     * @param {Fl64_Gpt_User_Back_Mod_User} modUser - User data model for retrieving user information.
     * @param {Fl64_Otp_Back_Mod_Token} modToken - Token model for managing user tokens.
     * @param {typeof Fl64_Gpt_User_Shared_Enum_Token_Type} TOKEN - Token type enumeration.
     */
    constructor(
        {
            Fl64_Gpt_User_Back_Defaults$: DEF,
            TeqFw_Core_Back_Config$: config,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            TeqFw_Email_Back_Service_Send$: serviceSend,
            Fl64_Gpt_User_Back_Mod_User$: modUser,
            Fl64_Otp_Back_Mod_Token$: modToken,
            'Fl64_Gpt_User_Shared_Enum_Token_Type.default': TOKEN,
        }
    ) {
        // VARS
        const RES_CODES_SEND = serviceSend.getResultCodes();
        let URL_BASE;

        /**
         * Initializes or retrieves the base URL for profile update links.
         * @return {string}
         */
        function getBaseUrl() {
            if (!URL_BASE) {
                const web = config.getLocal(DEF.SHARED.MOD_WEB.NAME);
                URL_BASE = `https://${web.urlBase}${DEF.SHARED.ROUTE_UPDATE}`;
            }
            return URL_BASE;
        }

        /**
         * Sends a profile update email for a specific user.
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
                        templateName: DEF.EMAIL_UPDATE,
                        vars,
                        locale: user.locale,
                        localeDef: localeApp,
                        localePlugin: DEF.LOCALE,
                    });
                    resultCode = success ? RESULT_CODES.SUCCESS : RESULT_CODES.EMAIL_SEND_FAILED;
                    logger.info(`Profile update email sent successfully to user #${userId}`);
                } else {
                    resultCode = RESULT_CODES.USER_NOT_FOUND;
                    logger.info(`User not found: userId=${userId}`);
                }
                if (!trx) await trxLocal.commit();
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Error during profile update email for user #${userId}: ${error.message}`);
                throw error;
            }
            return {resultCode};
        };

        /**
         * Prepares variables for the profile update email template.
         * @param {TeqFw_Db_Back_RDb_ITrans} trx - Transaction context.
         * @param {Fl64_Gpt_User_Shared_Dto_User.Dto} user - User data.
         * @returns {Promise<{edit_link: string}>}
         */
        this.prepareVars = async function (trx, user) {
            const {token} = await modToken.create({trx, userId: user.userRef, type: TOKEN.PROFILE_EDIT});
            const base = getBaseUrl();
            return {edit_link: base.replace(':code', token)};
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
         * @return {typeof Fl64_Gpt_User_Back_Email_Update_Init.RESULT_CODES}
         */
        this.getResultCodes = () => RESULT_CODES;
    }
}
