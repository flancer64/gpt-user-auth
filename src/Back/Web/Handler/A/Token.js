/**
 * Handles token exchange requests in an OAuth2 workflow.
 *
 * This class processes HTTP POST requests to the `/token` endpoint, validates authorization codes,
 * generates access and refresh tokens, and responds with the tokens in compliance with OAuth2 specifications.
 *
 * Responsibilities:
 * - Extracts and validates request parameters.
 * - Verifies the authorization code and client credentials.
 * - Generates access and refresh tokens with expiration times.
 * - Saves token information in the database for future validation.
 * - Responds with appropriate HTTP status codes and token data.
 */
export default class Fl64_Gpt_User_Back_Web_Handler_A_Token {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger - Logger instance
     * @param {TeqFw_Web_Back_App_Server_Respond} respond - Error response helper
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {Fl64_Gpt_User_Back_Mod_OAuth2_Client} modClient
     * @param {Fl64_Gpt_User_Back_Mod_OAuth2_Code} modCode
     * @param {Fl64_Gpt_User_Back_Mod_OAuth2_Token} modToken
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Back_App_Server_Respond$: respond,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            Fl64_Gpt_User_Back_Mod_OAuth2_Client$: modClient,
            Fl64_Gpt_User_Back_Mod_OAuth2_Code$: modCode,
            Fl64_Gpt_User_Back_Mod_OAuth2_Token$: modToken,
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
            /**
             * Extract parameters from the request body.
             * @type {string}
             */
            const body = await new Promise((resolve, reject) => {
                let data = '';
                req.on('data', chunk => { data += chunk; });
                req.on('end', () => resolve(data));
                req.on('error', err => reject(err));
            });

            const params = new URLSearchParams(body);
            const grantType = params.get('grant_type');
            const clientId = params.get('client_id');
            const clientSecret = params.get('client_secret');
            const code = params.get('code');
            const redirectUri = params.get('redirect_uri');

            // Validate the required parameters
            if (!grantType || grantType !== 'authorization_code') {
                respond.status400(res, 'Invalid or missing grant_type');
            } else if (!clientId || !clientSecret || !code || !redirectUri) {
                respond.status400(res, 'Missing required parameters');
            } else {
                const trx = await conn.startTransaction();
                try {
                    const foundCode = await modCode.read({trx, code});
                    if (foundCode && foundCode.dateExpired >= new Date()) {
                        const foundClient = await modClient.read({trx, id: foundCode.clientRef});
                        if ((foundClient.clientId === clientId) && (foundClient.clientSecret === clientSecret)) {
                            const dto = modToken.composeEntity();
                            dto.clientRef = foundClient.id;
                            dto.scope = foundCode.scope;
                            dto.userRef = foundCode.userRef;
                            dto.dateExpire = new Date(Date.now() + 7 * 24 * 3600 * 1000); // 1 week from now
                            const created = await modToken.create({trx, dto});
                            if (created) {
                                // Respond with the tokens
                                const body = JSON.stringify({
                                    access_token: created.accessToken,
                                    refresh_token: created.refreshToken,
                                    token_type: 'Bearer',
                                    expires_in: 7 * 24 * 3600 // in seconds
                                });
                                const headers = {
                                    'Content-Type': 'application/json',
                                    'Cache-Control': 'no-store',
                                    'Pragma': 'no-cache',
                                };
                                respond.status200(res, body, headers);
                            } else {
                                // Token creation failed
                                respond.status500(res, 'Failed to create tokens');
                            }
                        } else {
                            // Client credentials mismatch
                            respond.status401(res, 'Invalid client credentials');
                        }
                    } else {
                        respond.status400(res, 'Invalid or expired authorization code');
                    }
                    await trx.commit();
                } catch (error) {
                    logger.exception(error);
                    await trx.rollback();
                    respond.status500(res, error?.message);
                }
            }

        };
    }
}
