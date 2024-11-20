/**
 * Class for checking Bearer token presence in the shared object of the response.
 */
export default class Fl64_Gpt_User_Back_Mod_Auth {
    /**
     * @param {Fl64_Gpt_User_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger - Logger instance.
     * @param {Fl64_Gpt_User_Back_Mod_User} modUser
     * @param {typeof Fl64_Gpt_User_Shared_Enum_User_Status} STATUS
     */
    constructor(
        {
            Fl64_Gpt_User_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Fl64_Gpt_User_Back_Mod_User$: modUser,
            'Fl64_Gpt_User_Shared_Enum_User_Status.default': STATUS,
        }
    ) {
        /**
         * Checks if the shared object of the response contains a valid Bearer token flag.
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         * @returns {boolean} True if the Bearer token flag is present and true; otherwise, false.
         */
        this.hasBearerInResponse = function (res) {
            const shares = res?.[DEF.MOD_WEB.HNDL_SHARE];
            return shares?.[DEF.HTTP_SHARE_HAS_AUTH_BEARER] === true;
        };

        this.loadUser = async function ({trx, pin, passPhrase}) {
            let res;
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
