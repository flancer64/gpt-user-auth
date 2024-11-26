/**
 * DTO for initiating the profile editing process for the user.
 * @namespace Fl64_Gpt_User_Shared_Web_Api_Update_Init
 */

// VARS
/**
 * Result codes for the profile editing initiation process.
 * @memberOf Fl64_Gpt_User_Shared_Web_Api_Update_Init
 */
const RESULT_CODE = {
    SERVER_ERROR: 'SERVER_ERROR',
    SUCCESS: 'SUCCESS',
};
Object.freeze(RESULT_CODE);

// CLASSES
/**
 * Request structure for initiating the profile editing process.
 * @memberOf Fl64_Gpt_User_Shared_Web_Api_Update_Init
 */
class Request {
    /**
     * The email address associated with the user's account.
     * Serves as one of the identifiers for the profile editing request.
     * @type {string}
     * @example "user@example.com"
     */
    email;

    /**
     * Unique PIN assigned to the user during registration.
     * Serves as a numeric identifier for the user's account.
     * @type {number}
     * @example 123456
     */
    pin;
}

/**
 * Response structure for profile editing initiation.
 * @memberOf Fl64_Gpt_User_Shared_Web_Api_Update_Init
 */
class Response {
    /**
     * Human-readable status message describing the outcome of the profile editing initiation.
     * Helps the application or user understand what happened during the process.
     * @type {string}
     * @example "The profile editing link was successfully sent to the user's registered email address."
     */
    instructions;

    /**
     * Code representing the result of the profile editing initiation operation.
     * Helps programmatically determine the success or failure of the process.
     * @type {string}
     * @see Fl64_Gpt_User_Shared_Web_Api_Update_Init.RESULT_CODE
     */
    resultCode;
}

/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Fl64_Gpt_User_Shared_Web_Api_Update_Init {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
        }
    ) {
        // INSTANCE METHODS

        /**
         * Creates a request DTO for initiating the profile editing process.
         * @param {Fl64_Gpt_User_Shared_Web_Api_Update_Init.Request} [data]
         * @returns {Fl64_Gpt_User_Shared_Web_Api_Update_Init.Request}
         */
        this.createReq = function (data) {
            const req = new Request();
            req.email = cast.string(data?.email);
            req.pin = cast.int(data?.pin);
            return req;
        };

        /**
         * Creates a response DTO for the profile editing initiation process.
         * @param {Fl64_Gpt_User_Shared_Web_Api_Update_Init.Response} [data]
         * @returns {Fl64_Gpt_User_Shared_Web_Api_Update_Init.Response}
         */
        this.createRes = function (data) {
            const res = new Response();
            res.instructions = cast.string(data?.instructions);
            res.resultCode = cast.enum(data?.resultCode, RESULT_CODE);
            return res;
        };

        /**
         * Returns the available result codes for the profile editing initiation process.
         * @returns {typeof Fl64_Gpt_User_Shared_Web_Api_Update_Init.RESULT_CODE} A frozen object containing result codes.
         */
        this.getResultCodes = () => RESULT_CODE;
    }
}
