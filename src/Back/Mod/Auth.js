// IMPORT
import {constants as H2} from 'node:http2';

// VARS
const {
    HTTP2_HEADER_AUTHORIZATION,
} = H2;
/**
 * Class for checking Bearer token presence in the shared object of the response.
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
        /** @type {string[]} */
        let BEARERS;

        // FUNCS
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
                const authHeader = req.headers[HTTP2_HEADER_AUTHORIZATION];
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
