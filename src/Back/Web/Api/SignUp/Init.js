/**
 * Initialize the user registration in the backend.
 */
// MODULE'S IMPORTS
import {randomUUID} from 'crypto';

// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Fl64_Gpt_User_Back_Web_Api_SignUp_Init {
    /**
     * @param {Fl64_Gpt_User_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger - instance
     * @param {TeqFw_Web_Back_App_Server_Respond} respond
     * @param {Fl64_Gpt_User_Shared_Web_Api_SignUp_Init} endpoint
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {Fl64_Gpt_User_Back_Util_Log} utilLog
     * @param {Fl64_Gpt_User_Back_Mod_Auth} modAuth
     * @param {Fl64_Gpt_User_Back_Mod_User} modUser
     * @param {Fl64_Gpt_User_Back_Mod_Openai_User} modOaiUser
     * @param {Fl64_Gpt_User_Back_Email_SignUp_Init} emailSignUp
     * @param {typeof Fl64_Gpt_User_Shared_Enum_Token_Type} TOKEN
     */
    constructor(
        {
            Fl64_Gpt_User_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Back_App_Server_Respond$: respond,
            Fl64_Gpt_User_Shared_Web_Api_SignUp_Init$: endpoint,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            Fl64_Gpt_User_Back_Util_Log$: utilLog,
            Fl64_Gpt_User_Back_Mod_Auth$: modAuth,
            Fl64_Gpt_User_Back_Mod_User$: modUser,
            Fl64_Gpt_User_Back_Mod_Openai_User$: modOaiUser,
            Fl64_Gpt_User_Back_Email_SignUp_Init$: emailSignUp,
            'Fl64_Gpt_User_Shared_Enum_Token_Type.default': TOKEN,
        }
    ) {
        // VARS
        const CODE = endpoint.getResultCodes();

        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         * @param {Fl64_Gpt_User_Shared_Web_Api_SignUp_Init.Request} req
         * @param {Fl64_Gpt_User_Shared_Web_Api_SignUp_Init.Response} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} [context]
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            utilLog.traceOpenAi(context?.request);
            if (await modAuth.isValidRequest(context?.request)) {
                const rs = endpoint.createRes();
                rs.resultCode = CODE.SERVER_ERROR;
                rs.instructions = `
Unfortunately, an error occurred while processing your request. Please try again later. 
If the issue persists, contact the application support team.            
`;
                const trx = await conn.startTransaction();
                try {
                    const email = req.email;
                    const isConsent = req.isConsent;
                    const locale = req.locale;
                    const passPhrase = req.passPhrase;
                    // Check if the user consented to data processing
                    if (!isConsent) {
                        rs.resultCode = CODE.CONSENT_REQUIRED;
                        rs.instructions = `
Registration cannot proceed because you did not agree to the data processing terms. 
Please provide your consent to continue. If you have any questions regarding data processing, 
refer to the application's privacy policy or contact support for assistance.                    
`;
                        logger.info(rs.instructions);
                    } else {
                        // Check if the email is already registered
                        const found = await modUser.read({trx, email});
                        if (!found) {
                            // Register new user if email is not already registered
                            const dto = modUser.composeEntity();
                            dto.email = email;
                            dto.locale = locale;
                            dto.passSalt = randomUUID();
                            dto.passHash = modUser.hashPassPhrase({passPhrase, salt: dto.passSalt});
                            const createdUser = await modUser.create({trx, dto});
                            if (createdUser) {
                                const dtoOaiUser = modOaiUser.composeEntity();
                                dtoOaiUser.userRef = createdUser.userRef;
                                dtoOaiUser.ephemeralId = context.request.headers[DEF.HTTP_HEAD_OPENAI_EPHEMERAL_USER_ID];
                                await modOaiUser.create({trx, dto: dtoOaiUser});
                                await emailSignUp.execute({
                                    trx,
                                    userId: createdUser.userRef,
                                    tokenType: TOKEN.EMAIL_VERIFICATION
                                });
                                rs.resultCode = CODE.SUCCESS;
                                rs.pin = createdUser.pin;
                                rs.instructions = `
Registration has been successfully initiated. A verification email has been sent to your address. 
Please check your inbox and follow the link to complete the registration. Your PIN code is: ${rs.pin}. 
Please save it along with your passphrase. You will need it to access the application via chat.
`;
                            }
                        } else {
                            rs.resultCode = CODE.EMAIL_ALREADY_REGISTERED;
                            rs.instructions = `
The provided email is already registered in the system. If you have forgotten your PIN code or passphrase, 
please contact the administrator or use the account recovery feature. Re-registration is not possible.
`;
                        }
                    }
                    // Commit the transaction
                    await trx.commit();
                } catch (error) {
                    logger.exception(error);
                    await trx.rollback();
                }
                // Populate response
                Object.assign(res, rs);
            } else {
                respond.status403(context.response);
            }
        };
    }
}
