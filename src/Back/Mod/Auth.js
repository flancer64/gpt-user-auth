// IMPORT
import {constants as H2} from 'node:http2';

// VARS
const {
    HTTP2_HEADER_AUTHORIZATION,
} = H2;

/**
 * Handles user authentication and Bearer token validation.
 * Provides methods to verify authorized Bearer tokens in HTTP requests
 * and to authenticate users using PIN and passphrase.
 */
export default class Fl64_Gpt_User_Back_Mod_Auth {
    /**
     * @param {Fl64_Gpt_User_Back_Defaults} DEF
     * @param {TeqFw_Core_Back_Config} config
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {Fl64_Gpt_User_Back_Store_Context_HttpRequest} storeRequest
     * @param {Fl64_Gpt_User_Back_Mod_User} modUser
     * @param {Fl64_Gpt_User_Back_Mod_OAuth2_Token} modToken
     * @param {typeof Fl64_Gpt_User_Shared_Enum_User_Status} STATUS
     */
    constructor(
        {
            Fl64_Gpt_User_Back_Defaults$: DEF,
            TeqFw_Core_Back_Config$: config,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Fl64_Gpt_User_Back_Store_Context_HttpRequest$: storeRequest,
            Fl64_Gpt_User_Back_Mod_User$: modUser,
            Fl64_Gpt_User_Back_Mod_OAuth2_Token$: modToken,
            'Fl64_Gpt_User_Shared_Enum_User_Status.default': STATUS,
        }
    ) {
        // VARS
        /**
         * @type {string[]}
         * List of authorized Bearer tokens from local config.
         */
        let BEARERS;

        // FUNCS
        /**
         * Retrieves the authorized Bearer tokens from the local configuration.
         * Initializes the BEARERS array if it hasn't been loaded yet.
         * @returns {string[]} Authorized Bearer tokens.
         */
        function getAllowedBearers() {
            if (!Array.isArray(BEARERS)) {
                /** @type {Fl64_Gpt_User_Back_Plugin_Dto_Config_Local.Dto} */
                const cfg = config.getLocal(DEF.NAME);
                BEARERS = cfg?.authBearerTokens ?? [];
            }
            return BEARERS;
        }

        // MAIN
        /**
         * Extract authentication data stored in the request context.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - The incoming HTTP request.
         * @return {Fl64_Gpt_User_Back_Dto_OAuth2_Context.Dto}
         */
        this.getContextData = function (req) {
            return storeRequest.read(req);
        };

        /**
         * Validates the presence and authorization of a Bearer token in the HTTP request.
         * Ensures that either the OpenAI ephemeral user ID header is present or a valid Bearer token is provided.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - The incoming HTTP request.
         * @returns {Promise<boolean>} True if the request is authorized; otherwise, false.
         */
        this.isValidRequest = async function (req) {
            let result = false;
            try {
                const oaiUserHeader = req?.headers[DEF.HTTP_HEAD_OPENAI_EPHEMERAL_USER_ID];
                if (oaiUserHeader) {
                    const authHeader = req?.headers[HTTP2_HEADER_AUTHORIZATION];
                    if (authHeader && authHeader.startsWith('Bearer ')) {
                        const bearerToken = authHeader.slice(7); // Remove 'Bearer ' prefix
                        const allowed = getAllowedBearers();
                        if (allowed.includes(bearerToken)) {
                            // this is a hardcoded token from app config (./cfg.local.json)
                            result = true;
                        } else {
                            // try to find the token in OAuth2 tokens
                            const found = await modToken.read({tokenAccess: bearerToken});
                            if (found) {
                                const dto = storeRequest.composeEntity();
                                dto.clientId = found.clientRef;
                                dto.userId = found.userRef;
                                storeRequest.create(req, dto);
                            } else {
                                logger.error(`Authorization failed: Invalid Bearer token '${bearerToken}'.`);
                            }
                        }
                    }
                } else {
                    logger.error(`Authorization failed: Missing OpenAI ephemeral user ID header.`);
                }
            } catch (e) {
                logger.exception(e);
            }
            return result;
        };

        /**
         * Authenticates a user using their PIN and passphrase.
         * Verifies the passphrase against the stored hash and checks if the user status is active.
         * @param {object} trx - Transaction context for database operations.
         * @param {string} pin - The user's public PIN.
         * @param {string} passPhrase - The user's passphrase for authentication.
         * @returns {Promise<object|null>} The authenticated user object if successful; otherwise, null.
         */
        this.loadUser = async function ({trx, pin, passPhrase}) {
            let res = null;
            try {
                const found = await modUser.read({trx, pin});
                if (found) {
                    const hash = modUser.hashPassPhrase({passPhrase, salt: found.passSalt});
                    if ((hash === found.passHash) && (found.status === STATUS.ACTIVE)) {
                        res = found;
                    }
                }
            } catch (e) {
                logger.exception(e);
            }
            return res;
        };

    }
}
