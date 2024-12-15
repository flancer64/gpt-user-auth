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
     * @param {Fl64_Gpt_User_Back_Mod_OAuth2_Client} modClient
     * @param {Fl64_Gpt_User_Back_Mod_OAuth2_Token} modToken
     * @param {Fl64_Gpt_User_Back_Mod_User_Session} modSession
     * @param {Fl64_Gpt_User_Back_Mod_User} modUser
     * @param {Fl64_Gpt_User_Back_Web_Handler_A_Authorize_A_Helper} aHelper
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Back_App_Server_Respond$: respond,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            Fl64_Gpt_User_Back_Mod_OAuth2_Client$: modClient,
            Fl64_Gpt_User_Back_Mod_OAuth2_Token$: modToken,
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
             * @param {Object} vars
             * @return {Promise<void>}
             */
            async function handleTemplate(filePath, res, vars = {}) {
                // FUNCS
                /**
                 * Replaces variables in the template with their corresponding values.
                 * Variables in the template should be in the format {{variableName}}.
                 * @param {string} template - The template string with placeholders.
                 * @param {object} vars - The key-value pairs for variable substitution.
                 * @returns {string} The template with variables replaced by their values.
                 */
                function replaceVariables(template, vars) {
                    return template.replace(/{{(\w+)}}/g, (match, varName) => {
                        return vars[varName] !== undefined ? vars[varName] : match;
                    });
                }

                // MAIN
                let htmlContent = await readFile(filePath, 'utf-8');
                htmlContent = replaceVariables(htmlContent, vars);
                res.writeHead(HTTP_STATUS_OK, {
                    [HTTP2_HEADER_CONTENT_TYPE]: 'text/html; charset=utf-8',
                });
                res.write(htmlContent);
                res.end();
            }

            /**
             * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request.
             * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res - HTTP response object
             * @return {Promise<void>}
             */
            async function doAuthorizeGet(req, res) {
                const trx = await conn.startTransaction();
                try {
                    const url = new URL(req.url, `https://${req.headers.host}`);
                    const params = new URLSearchParams(url.search); // Разбираем строку запроса на параметры
                    const clientId = params.get('client_id');
                    const scope = params.get('scope');
                    const redirectUri = params.get('redirect_uri');
                    const state = params.get('state');
                    const responseType = params.get('response_type');
                    if (responseType === 'code') {
                        const found = await modClient.read({trx, clientId});

                        // Resolve path to the authorize template
                        const filePath = path.resolve(__dirname, '../../../../../web/tmpl/oauth2/authorize.html');
                        await handleTemplate(filePath, res, {
                            clientName: found.name,
                            redirectUri: redirectUri,
                            responseType: responseType,
                            scope: scope,
                            state: state,
                        });
                    } else {
                        // TODO:
                    }
                    // Commit the transaction
                    await trx.commit();
                } catch (error) {
                    logger.exception(error);
                    await trx.rollback();
                    respond.status500(res, error?.message);
                }
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
                    await doAuthorizeGet(req, res);
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
