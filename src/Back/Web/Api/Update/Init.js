/**
 * Initialize the password change process for the user.
 *
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Fl64_Gpt_User_Back_Web_Api_Update_Init {
    /**
     * @param {Fl64_Gpt_User_Back_Defaults} DEF
     * @param {TeqFw_Core_Back_Config} config
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {Fl64_Gpt_User_Shared_Web_Api_Update_Init} endpoint
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {TeqFw_Web_Back_App_Server_Respond.respond403|function} respond403
     * @param {TeqFw_Email_Back_Act_Send} actSend
     * @param {Fl64_Gpt_User_Back_Mod_Auth} modAuth
     * @param {Fl64_Gpt_User_Back_Mod_User} modUser
     * @param {Fl64_Gpt_User_Back_Mod_Token} modToken
     * @param {TeqFw_Email_Back_Service_Load} serviceEmailLoad
     * @param {typeof Fl64_Gpt_User_Shared_Enum_Token_Type} TYPE
     */
    constructor(
        {
            Fl64_Gpt_User_Back_Defaults$: DEF,
            TeqFw_Core_Back_Config$: config,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Fl64_Gpt_User_Shared_Web_Api_Update_Init$: endpoint,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            'TeqFw_Web_Back_App_Server_Respond.respond403': respond403,
            TeqFw_Email_Back_Act_Send$: actSend,
            Fl64_Gpt_User_Back_Mod_Auth$: modAuth,
            Fl64_Gpt_User_Back_Mod_User$: modUser,
            Fl64_Gpt_User_Back_Mod_Token$: modToken,
            TeqFw_Email_Back_Service_Load$: serviceEmailLoad,
            Fl64_Gpt_User_Shared_Enum_Token_Type$: TYPE,
        }
    ) {
        // VARS
        const RESULT_CODE = endpoint.getResultCodes();
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
                URL_BASE = `https://${web.urlBase}${DEF.SHARED.ROUTE_UPDATE}`;
            }
            return URL_BASE;
        }

        // INSTANCE METHODS

        /**
         * Retrieve the endpoint definition.
         * @return {Fl64_Gpt_User_Shared_Web_Api_Update_Init}
         */
        this.getEndpoint = () => endpoint;

        /**
         * Initialize the service. Placeholder for any initialization logic.
         * @return {Promise<void>}
         */
        this.init = async function () { };

        /**
         * Process the request to initialize the profile update process.
         *
         * @param {Fl64_Gpt_User_Shared_Web_Api_Update_Init.Request} req - Request DTO.
         * @param {Fl64_Gpt_User_Shared_Web_Api_Update_Init.Response} res - Response DTO.
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} [context] - Optional service context.
         * @return {Promise<void>}
         */
        this.process = async function (req, res, context) {
            // Ensure the request is authorized
            if (!modAuth.hasBearerInRequest(context?.request)) {
                respond403(context?.response);
                return;
            }

            const rs = endpoint.createRes();
            const trx = await conn.startTransaction();

            try {
                // Validate the input PIN
                const pin = req.pin;
                logger.info(`Profile update process initiated with PIN: ${pin}.`);

                const foundUser = await modUser.read({trx, pin});
                if (foundUser?.userRef) {
                    const dtoToken = modToken.composeEntity();
                    dtoToken.userRef = foundUser.userRef;
                    dtoToken.type = TYPE.PROFILE_EDIT;
                    const {code} = await modToken.create({trx, dto: dtoToken});
                    const base = getBaseUrl();
                    const verify_link = base.replace(':code', code);
                    const {subject, text, html} = await serviceEmailLoad.execute({
                        pkg: DEF.NAME,
                        templateName: DEF.EMAIL_UPDATE,
                        vars: {verify_link},
                        locale: foundUser.locale,
                        localeDef: DEF.LOCALE,
                    });
                    // Send the verification email
                    actSend.act({to: foundUser.email, subject, text, html}).catch(logger.exception);
                } else {
                    logger.info(`No user found for PIN: ${pin}.`);
                }

                // Commit the transaction
                await trx.commit();
                rs.resultCode = RESULT_CODE.SUCCESS;
            } catch (error) {
                logger.exception(error);
                await trx.rollback();
                rs.message = 'An unexpected error occurred during the profile update process.';
                rs.resultCode = RESULT_CODE.SERVER_ERROR;
            }

            // Populate the response object
            Object.assign(res, rs);
        };
    }
}
