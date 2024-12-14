// MODULE'S IMPORT
import {constants as H2} from 'node:http2';
import path from 'path';
import {fileURLToPath} from 'url';
import {readFile} from 'fs/promises';

// MODULE'S VARS
const {
    HTTP2_HEADER_CONTENT_TYPE,
    HTTP2_METHOD_GET,
    HTTP2_METHOD_POST,
    HTTP_STATUS_OK,
} = H2;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/**
 */
export default class Fl64_Gpt_User_Back_Web_Handler_A_Authorize {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger - Logger instance
     * @param {TeqFw_Web_Back_App_Server_Respond} respond - Error response helper
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {Fl64_Gpt_User_Back_Mod_User_Session} modSession
     * @param {Fl64_Gpt_User_Back_Mod_User} modUser
     * @param {Fl64_Gpt_User_Back_Web_Handler_A_Authorize_A_Helper} aHelper
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Back_App_Server_Respond$: respond,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            Fl64_Gpt_User_Back_Mod_User_Session$: modSession,
            Fl64_Gpt_User_Back_Mod_User$: modUser,
            Fl64_Gpt_User_Back_Web_Handler_A_Authorize_A_Helper$: aHelper,
        }
    ) {
        // VARS

        // MAIN
        /**
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res - HTTP response object
         *
         * @return {Promise<void>}
         */
        this.act = async function (req, res) {
            // FUNCS

            /**
             * Sends the content of an HTML file as an HTTP response.
             * @param {string} filePath - Path to the HTML file.
             * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res - HTTP response object.
             * @return {Promise<void>}
             */
            async function handleTemplate(filePath, res) {
                const htmlContent = await readFile(filePath, 'utf-8');
                res.writeHead(HTTP_STATUS_OK, {
                    [HTTP2_HEADER_CONTENT_TYPE]: 'text/html; charset=utf-8',
                });
                res.end(htmlContent);
            }

            async function doAuthorizeGet() {
                // Resolve path to the authorize template
                const filePath = path.resolve(__dirname, '../../../../../web/tmpl/oauth2/authorize.html');
                await handleTemplate(filePath, res);
            }

            async function doLoginGet() {
                // Resolve path to the login template
                const filePath = path.resolve(__dirname, '../../../../../web/tmpl/oauth2/login.html');
                await handleTemplate(filePath, res);
            }

            /**
             * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request.
             * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res - HTTP response object
             * @return {Promise<void>}
             */
            async function doLoginPost(req, res) {
                // Collect incoming data
                const {identifier, password} = await aHelper.extractAuthParams({req});
                if (identifier && password) {
                    const trx = await conn.startTransaction();
                    try {
                        // Validate the user credentials and establish a new user session
                        const authenticatedUser = await modUser.authenticate({trx, identifier, password});
                        if (authenticatedUser) {
                            await modSession.establish({trx, user: authenticatedUser, req, res});
                            // Send response to refresh the page
                            respond.status303(res, req.url);
                        } else {
                            respond.status401(res, 'Invalid credentials');
                        }
                        // Commit the transaction
                        await trx.commit();
                    } catch (error) {
                        logger.exception(error);
                        await trx.rollback();
                        respond.status500(res, error?.message);
                    }
                } else {
                    respond.status400(res, 'Missing identifier or password');
                }
            }

            // MAIN
            try {
                // Check if the user is authenticated
                const sessionEstablished = await modSession.getSessionFromRequest({req});
                if (sessionEstablished) {
                    await doAuthorizeGet();
                } else {
                    if (req.method === HTTP2_METHOD_GET) {
                        await doLoginGet();
                    } else if (req.method === HTTP2_METHOD_POST) {
                        await doLoginPost(req, res);
                    }
                }
            } catch (error) {
                logger.error(`Error processing request: ${error.message}`);
                respond.status500(res, error);
            }
        };

    }
}
