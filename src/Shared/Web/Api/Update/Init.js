/**
 * Data Transfer Objects (DTOs) and supporting logic for initiating the profile editing process.
 * This script contains:
 * - The request DTO defining the input structure required to generate a profile editing link.
 * - The response DTO defining the output structure returned by the API.
 * - Result codes indicating the outcome of the operation.
 * - Factory functions for creating and validating DTOs.
 *
 * The API allows users to request a secure, single-use link for editing their profile by providing
 * either their email address or PIN for identification.
 *
 * @namespace Fl64_Gpt_User_Shared_Web_Api_Update_Init
 */


// VARS
/**
 * Enumeration of possible result codes for the profile editing initiation process.
 * These codes indicate the outcome of the operation and help the application
 * handle the response appropriately.
 *
 * @memberOf Fl64_Gpt_User_Shared_Web_Api_Update_Init
 */
const RESULT_CODE = {
    /**
     * Indicates that an internal server error occurred while processing the request.
     * The operation could not be completed, and the user should retry later.
     */
    SERVER_ERROR: 'SERVER_ERROR',

    /**
     * Indicates that the profile editing link was successfully generated
     * and sent to the user's registered email address.
     */
    SUCCESS: 'SUCCESS',
};
Object.freeze(RESULT_CODE);


// CLASSES
/**
 * Request DTO for initiating the profile editing process.
 * This structure defines the input data required by the API to generate a secure, single-use link
 * for editing the user's profile. The user can provide either their email or PIN for identification.
 * If both identifiers are provided, the system prioritizes the email for the lookup.
 *
 * @memberOf Fl64_Gpt_User_Shared_Web_Api_Update_Init
 */
class Request {
    /**
     * The email address associated with the user's account.
     * This field is the primary identifier for the profile editing request.
     * If both email and PIN are provided, the system will prioritize searching by email.
     *
     * @type {string|null}
     * @example "user@example.com"
     */
    email;

    /**
     * Unique PIN assigned to the user during registration.
     * Serves as an alternative numeric identifier for the user's account.
     * If the user is not found by email, the system will use the PIN to attempt identification.
     *
     * @type {number|null}
     * @example 123456
     */
    pin;
}

/**
 * Response DTO for the profile editing initiation process.
 * Defines the structure of the data returned by the API after processing a request
 * to generate a secure, single-use link for editing the user's profile.
 * This response helps both the application and the user understand the outcome of the operation.
 *
 * @memberOf Fl64_Gpt_User_Shared_Web_Api_Update_Init
 */
class Response {
    /**
     * A human-readable message describing the result of the operation.
     * Provides feedback on whether the profile editing link was successfully sent
     * or if an error occurred. This message should be localized to the user's preferred language.
     *
     * @type {string}
     * @example "The profile editing link was successfully sent to the user's registered email address."
     * @example "The provided email or PIN did not match any registered user."
     */
    instructions;

    /**
     * A code representing the result of the profile editing initiation process.
     * This code is used programmatically to determine the success or failure of the operation.
     *
     * @type {string}
     * @see Fl64_Gpt_User_Shared_Web_Api_Update_Init.RESULT_CODE
     * @example "SUCCESS"
     * @example "SERVER_ERROR"
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
