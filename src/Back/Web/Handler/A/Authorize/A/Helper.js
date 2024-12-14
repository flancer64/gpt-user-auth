/**
 * Methods in this helper can be overridden at the object container level.
 * This flexibility allows customization of authentication parameter parsing
 * (e.g., switching from form-encoded POST requests to JSON-based requests).
 * For this reason, the code is placed in a dedicated namespace.
 *
 * @namespace Fl64_Gpt_User_Back_Web_Handler_A_Authorize_A_Helper
 */

// Constants for parameter names
const PARAM_ID = 'identifier';
const PARAM_PASSWORD = 'password';

export default class Fl64_Gpt_User_Back_Web_Handler_A_Authorize_A_Helper {
    /**
     * Extracts authentication data from an HTTP request.
     * @param {Object} req - The HTTP request object.
     * @return {Promise<{identifier: string, password: string}>} - Parsed identifier and password.
     */
    async extractAuthParams({req}) {
        let body = '';
        for await (const chunk of req) body += chunk; // Accumulate request body
        const parsedBody = new URLSearchParams(body); // Parse form-encoded data
        return {
            identifier: parsedBody.get(PARAM_ID),
            password: parsedBody.get(PARAM_PASSWORD),
        };
    }
}
