// IMPORT
import {constants as H2} from 'node:http2';

// VARS
const {
    HTTP2_HEADER_AUTHORIZATION,
} = H2;

/**
 * Class for handling user authentication and Bearer token validation.
 * This class provides methods for verifying the presence of an authorized Bearer token
 * in HTTP requests and loading user details using PIN and passphrase authentication.
 */
export default class Fl64_Gpt_User_Back_Mod_Auth {
    /**
     * @param {Fl64_Gpt_User_Back_Defaults} DEF
     * @param {TeqFw_Core_Back_Config} config
     * @param {TeqFw_Core_Shared_Api_Logger} logger - Logger instance.
     * @param {Fl64_Gpt_User_Back_Mod_User} modUser
     * @param {typeof Fl64_Gpt_User_Shared_Enum_User_Status} STATUS
     */
    constructor(
        {
            Fl64_Gpt_User_Back_Defaults$: DEF,
            TeqFw_Core_Back_Config$: config,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Fl64_Gpt_User_Back_Mod_User$: modUser,
            'Fl64_Gpt_User_Shared_Enum_User_Status.default': STATUS,
        }
    ) {
        // VARS
        /**
         * @type {string[]}
         * Stores a list of allowed Bearer tokens.
         */
        let BEARERS;

        // FUNCS
        /**
         * Retrieves the list of allowed Bearer tokens from the local configuration.
         * @returns {string[]} List of authorized Bearer tokens.
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
         * Checks if the HTTP request contains a valid Bearer token.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req
         * @returns {boolean} True if the Bearer token is present and is authorized; otherwise, false.
         */
        this.hasBearerInRequest = function (req) {
            let result = false;
            try {
                const authHeader = req?.headers[HTTP2_HEADER_AUTHORIZATION];
                if (authHeader && authHeader.startsWith('Bearer ')) {
                    const bearerToken = authHeader.slice(7); // Remove 'Bearer ' prefix
                    const allowed = getAllowedBearers();
                    if (allowed.includes(bearerToken)) {
                        result = true;
                    } else {
                        logger.error(`Failed to authorize request. Invalid Bearer token: '${bearerToken}'.`);
                    }
                }
            } catch (e) {
                logger.exception(e);
            }
            return result;
        };

        /**
         * Loads user details based on PIN and passphrase.
         * Verifies the passphrase hash and user status.
         * @param {object} trx - Transaction context for database operations.
         * @param {string} pin - User's public PIN.
         * @param {string} passPhrase - User's passphrase for authentication.
         * @returns {Promise<object|null>} User object if authenticated successfully, otherwise null.
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
