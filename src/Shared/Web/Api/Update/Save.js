/**
 * DTO for saving user profile changes.
 * @namespace Fl64_Gpt_User_Shared_Web_Api_Update_Save
 */

// VARS
/**
 * Result codes for the profile update operation.
 * @memberOf Fl64_Gpt_User_Shared_Web_Api_Update_Save
 */
const RESULT_CODE = {
    INVALID_TOKEN: 'INVALID_TOKEN',          // The provided token is invalid or has expired.
    SUCCESS: 'SUCCESS',                      // Profile data was successfully updated.
    SERVER_ERROR: 'SERVER_ERROR',            // An unexpected server error occurred during processing.
    INVALID_INPUT: 'INVALID_INPUT',          // The input data provided by the user is invalid.
};
Object.freeze(RESULT_CODE);

// CLASSES
/**
 * Request DTO for saving user profile changes.
 * @memberOf Fl64_Gpt_User_Shared_Web_Api_Update_Save
 */
class Request {
    /**
     * Access token provided for editing the profile.
     * This token is sent to the user's email and validates the update operation.
     * @type {string}
     */
    token;

    /**
     * New locale for the user.
     * Optional field to update the user's preferred language and region.
     * @type {string}
     * @example "en-US"
     */
    locale;

    /**
     * New password for the user.
     * Optional field to update the user's password.
     * @type {string}
     */
    passphrase;
}

/**
 * Response DTO for the profile update operation.
 * @memberOf Fl64_Gpt_User_Shared_Web_Api_Update_Save
 */
class Response {
    /**
     * Result code of the operation.
     * @type {string}
     * @see Fl64_Gpt_User_Shared_Web_Api_Update_Save.RESULT_CODE
     */
    resultCode;
}

/**
 * Endpoint for saving user profile changes.
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Fl64_Gpt_User_Shared_Web_Api_Update_Save {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     * Utility for type casting and validation.
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
        }
    ) {
        // INSTANCE METHODS

        /**
         * Creates a request DTO for saving profile changes.
         * @param {Fl64_Gpt_User_Shared_Web_Api_Update_Save.Request} [data]
         * Optional input data to populate the request DTO.
         * @returns {Fl64_Gpt_User_Shared_Web_Api_Update_Save.Request}
         * A populated request DTO instance.
         */
        this.createReq = function (data) {
            const req = new Request();
            req.locale = cast.string(data?.locale);
            req.passphrase = cast.string(data?.passphrase);
            req.token = cast.string(data?.token);
            return req;
        };

        /**
         * Creates a response DTO for the profile update operation.
         * @param {Fl64_Gpt_User_Shared_Web_Api_Update_Save.Response} [data]
         * Optional input data to populate the response DTO.
         * @returns {Fl64_Gpt_User_Shared_Web_Api_Update_Save.Response}
         * A populated response DTO instance.
         */
        this.createRes = function (data) {
            const res = new Response();
            res.resultCode = cast.enum(data?.resultCode, RESULT_CODE);
            return res;
        };

        /**
         * Returns the available result codes for the profile update operation.
         * @returns {typeof Fl64_Gpt_User_Shared_Web_Api_Update_Save.RESULT_CODE} A frozen object containing result codes.
         */
        this.getResultCodes = () => RESULT_CODE;
    }
}
