/**
 * Web server handler to process requests to OAuth2 endpoints.
 */
// MODULE'S IMPORT
import {constants as H2} from 'node:http2';

// MODULE'S VARS
const {
    HTTP2_METHOD_GET,
    HTTP2_METHOD_POST,
} = H2;

// MODULE'S CLASSES
/**
 * Handles requests targeting the 'fl64-gpt-user' namespace for OAuth2 operations.
 * Implements the TeqFw_Web_Back_Api_Dispatcher_IHandler interface.
 */
export default class Fl64_Gpt_User_Back_Web_Handler {
    /**
     * Initializes the handler with necessary dependencies and configurations.
     *
     * @param {Fl64_Gpt_User_Back_Defaults} DEF - Default settings for the module
     * @param {TeqFw_Core_Shared_Api_Logger} logger - Logger instance
     * @param {TeqFw_Web_Back_App_Server_Respond} respond  - Error response helper
     * @param {Fl64_Gpt_User_Back_Web_Handler_A_Authorize} aAuthorize
     * @param {Fl64_Gpt_User_Back_Web_Handler_A_Logout} aLogout
     * @param {Fl64_Gpt_User_Back_Web_Handler_A_Token} aToken
     */
    constructor(
        {
            Fl64_Gpt_User_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Back_App_Server_Respond$: respond,
            Fl64_Gpt_User_Back_Web_Handler_A_Authorize$: aAuthorize,
            Fl64_Gpt_User_Back_Web_Handler_A_Logout$: aLogout,
            Fl64_Gpt_User_Back_Web_Handler_A_Token$: aToken,
        }
    ) {
        /**
         * Processes HTTP requests that match the handler's namespace and method.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res - HTTP response object
         */
        async function process(req, res) {
            try {
                // ".../fl64-gpt-user/authorize?response_type=..." => "authorize"
                const fullPath = req.url.split('?')[0];
                const baseIndex = fullPath.indexOf(DEF.SHARED.SPACE);
                const relativePath = fullPath.slice(baseIndex + DEF.SHARED.SPACE.length + 1);
                const endpoint = relativePath.split('/')[0];

                switch (endpoint) {
                    case 'authorize':
                        await aAuthorize.act(req, res);
                        break;
                    case 'token':
                        await aToken.act(req, res);
                        break;
                    case 'logout':
                        await aLogout.act(req, res);
                        break;
                    default:
                    // do nothing, the web plugin will process 404
                }
            } catch (error) {
                logger.exception(error);
                respond.status500(res, error);
            }
        }

        // INSTANCE METHODS

        /**
         * Returns the request processor function.
         * @returns {Function}
         */
        this.getProcessor = () => process;

        /**
         * Initialization logic for the handler. Can be used for async setup tasks.
         */
        this.init = async function () { };

        /**
         * Determines if the handler can process the given request.
         *
         * @param {Object} options - Contains request method and address
         * @param {string} options.method - HTTP method of the request
         * @param {Object} options.address - Address information of the request
         * @returns {boolean} True if the handler can process the request, otherwise false
         */
        this.canProcess = function ({method, address} = {}) {
            return (
                ((method === HTTP2_METHOD_GET) || (method === HTTP2_METHOD_POST))
                && (address?.space === DEF.SHARED.SPACE)
            );
        };
    }
}
