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
 * Handles OAuth2 authorization workflows.
 *
 * This class processes incoming HTTP requests for authorization,
 * manages sessions, and responds with appropriate templates or JSON responses.
 * It integrates with database modules and OAuth2-related services.
 */
export default class Fl64_Gpt_User_Back_Web_Handler_A_Authorize {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger - Logger instance
     * @param {TeqFw_Web_Back_App_Server_Respond} respond - Error response helper
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {Fl64_Gpt_User_Back_Mod_OAuth2_Client} modClient
     * @param {Fl64_Gpt_User_Back_Mod_OAuth2_Code} modCode
     * @param {Fl64_Gpt_User_Back_Mod_User} modUser
     * @param {Fl64_Web_Session_Back_Manager} mgrSession
     * @param {Fl64_Gpt_User_Back_Web_Handler_A_Authorize_A_Helper} aHelper
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Back_App_Server_Respond$: respond,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            Fl64_Gpt_User_Back_Mod_OAuth2_Client$: modClient,
            Fl64_Gpt_User_Back_Mod_OAuth2_Code$: modCode,
            Fl64_Gpt_User_Back_Mod_User$: modUser,
            Fl64_Web_Session_Back_Manager$: mgrSession,
            Fl64_Gpt_User_Back_Web_Handler_A_Authorize_A_Helper$: aHelper,
        }
    ) {
        // VARS

        // MAIN
        /**
         * Main entry point for handling HTTP requests.
         *
         * Depending on the authentication state and request method,
         * it directs to either login or authorization workflows.
         *
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
             * Handles the OAuth2 authorization workflow via GET requests.
             *
             * The function retrieves query parameters, validates the client, and generates an authorization code
             * if the request meets all criteria. It sends the generated code and additional details to the user's browser
             * using an HTML template.
             *
             * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request.
             * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res - HTTP response object.
             * @param {Fl64_Web_Session_Back_Store_RDb_Schema_Session.Dto} session
             * @return {Promise<void>}
             */
            async function doAuthorizeGet(req, res, session) {
                const trx = await conn.startTransaction();
                try {
                    const url = new URL(req.url, `https://${req.headers.host}`);
                    const params = new URLSearchParams(url.search);

                    // Extract and validate required OAuth2 parameters
                    const clientId = params.get('client_id');
                    const scope = params.get('scope');
                    const redirectUri = params.get('redirect_uri');
                    const state = params.get('state');
                    const responseType = params.get('response_type');

                    if (responseType === 'code') {
                        // Fetch and validate the client from the database
                        const client = await modClient.read({trx, clientId});
                        if (client) {
                            const dto = modCode.composeEntity();
                            dto.clientRef = client.id;
                            dto.dateExpired = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes
                            dto.redirectUri = redirectUri;
                            dto.scope = scope;
                            dto.userRef = session.user_ref;
                            const created = await modCode.create({trx, dto});

                            // Render the authorization template with provided variables
                            const filePath = path.resolve(__dirname, '../../../../../web/tmpl/oauth2/authorize.html');
                            await handleTemplate(filePath, res, {
                                clientName: client.name,
                                code: created.code,
                                redirectUri: redirectUri,
                                responseType: responseType,
                                scope: scope,
                                state: state,
                            });
                        } else {
                            respond.status404(res, 'Client not found');
                        }
                    } else {
                        respond.status400(res, 'Invalid response type');
                    }
                    // Commit the transaction after successful processing
                    await trx.commit();
                } catch (error) {
                    // Rollback the transaction and log the exception in case of errors
                    logger.exception(error);
                    await trx.rollback();
                    respond.status500(res, error?.message);
                }
            }

            /**
             * Handles the OAuth2 login workflow via GET requests.
             *
             * The function renders an HTML form that prompts the user to log in.
             *
             * @return {Promise<void>}
             */
            async function doLoginGet() {
                // Render the login form template
                const filePath = path.resolve(__dirname, '../../../../../web/tmpl/oauth2/login.html');
                await handleTemplate(filePath, res);
            }

            /**
             * Handles the OAuth2 login workflow via POST requests.
             *
             * The function extracts login credentials from the request, validates them,
             * and establishes a new session if authentication is successful.
             *
             * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request.
             * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res - HTTP response object.
             * @return {Promise<void>}
             */
            async function doLoginPost(req, res) {
                // Extract credentials from the request body
                const {identifier, password} = await aHelper.extractAuthParams({req});
                if (identifier && password) {
                    const trx = await conn.startTransaction();
                    try {
                        // Authenticate the user and establish a new session
                        const authenticatedUser = await modUser.authenticate({trx, identifier, password});
                        if (authenticatedUser?.userRef) {
                            const userId = authenticatedUser.userRef;
                            await mgrSession.establish({trx, userId, req, res,});
                            // Redirect the user to refresh the page after login
                            respond.status303(res, req.url);
                        } else {
                            respond.status401(res, 'Invalid credentials');
                        }
                        // Commit the transaction on successful login
                        await trx.commit();
                    } catch (error) {
                        // Rollback the transaction and log the exception in case of errors
                        logger.exception(error);
                        await trx.rollback();
                        respond.status500(res, error?.message);
                    }
                } else {
                    // Respond with an error if required fields are missing
                    respond.status400(res, 'Missing identifier or password');
                }
            }

            // MAIN
            try {
                // Check if the user is authenticated
                const {dto: sessionEstablished} = await mgrSession.getFromRequest({req});
                if (sessionEstablished) {
                    await doAuthorizeGet(req, res, sessionEstablished);
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
