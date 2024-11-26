/**
 * DTO for retrieving the user profile data for editing.
 * @namespace Fl64_Gpt_User_Shared_Web_Api_Update_Load
 */

// VARS
/**
 * Result codes for the user profile data retrieval process.
 * @memberOf Fl64_Gpt_User_Shared_Web_Api_Update_Load
 */
const RESULT_CODE = {
    INVALID_TOKEN: 'INVALID_TOKEN',           // The provided token is invalid or has expired.
    SUCCESS: 'SUCCESS',                       // Profile data was successfully retrieved.
    SERVER_ERROR: 'SERVER_ERROR'              // An unexpected server error occurred during processing.
};
Object.freeze(RESULT_CODE);

// CLASSES
/**
 * Request DTO for retrieving user profile data.
 * @memberOf Fl64_Gpt_User_Shared_Web_Api_Update_Load
 */
class Request {
    /**
     * The access token provided for editing the profile.
     * This token is sent to the user's registered email and grants temporary access
     * to the profile editing functionality. The token is invalidated after use
     * or expires after a predefined time period (e.g., 1 hour).
     * @type {string}
     */
    token;
}

/**
 * Response DTO for returning user profile data.
 * @memberOf Fl64_Gpt_User_Shared_Web_Api_Update_Load
 */
class Response {
    /**
     * The timestamp when the user account was created.
     * @type {Date}
     * @example "2023-01-01T00:00:00Z"
     */
    dateCreated;

    /**
     * The email address associated with the user's account.
     * @type {string}
     * @example "user@example.com"
     */
    email;

    /**
     * The user's preferred locale for interactions with the application.
     * @type {string}
     * @example "en-US"
     */
    locale;

    /**
     * The unique numeric PIN assigned to the user during registration.
     * Serves as a public identifier for the user's account.
     * @type {number}
     * @example 123456
     */
    pin;

    /**
     * Result code of the operation.
     * @type {string}
     * @see Fl64_Gpt_User_Shared_Web_Api_Update_Load.RESULT_CODE
     */
    resultCode;

    /**
     * The current status of the user's account.
     * @type {string}
     * @see Fl64_Gpt_User_Shared_Enum_User_Status
     */
    status;
}

/**
 * Endpoint for retrieving user profile data for editing.
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Fl64_Gpt_User_Shared_Web_Api_Update_Load {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast Utility for casting data to specific types.
     * @param {typeof Fl64_Gpt_User_Shared_Enum_User_Status} STATUS Enumeration of possible user account statuses.
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
            'Fl64_Gpt_User_Shared_Enum_User_Status.default': STATUS,
        }
    ) {
        // INSTANCE METHODS

        /**
         * Creates a request DTO for retrieving profile data.
         * @param {Fl64_Gpt_User_Shared_Web_Api_Update_Load.Request} [data]
         * Optional input data to populate the request DTO.
         * @returns {Fl64_Gpt_User_Shared_Web_Api_Update_Load.Request}
         * A populated request DTO instance.
         */
        this.createReq = function (data) {
            const req = new Request();
            req.token = cast.string(data?.token);
            return req;
        };

        /**
         * Creates a response DTO containing user profile data.
         * @param {Fl64_Gpt_User_Shared_Web_Api_Update_Load.Response} [data]
         * Optional input data to populate the response DTO.
         * @returns {Fl64_Gpt_User_Shared_Web_Api_Update_Load.Response}
         * A populated response DTO instance.
         */
        this.createRes = function (data) {
            const res = new Response();
            res.dateCreated = cast.date(data?.dateCreated);
            res.email = cast.string(data?.email);
            res.locale = cast.string(data?.locale);
            res.pin = cast.int(data?.pin);
            res.resultCode = cast.enum(data?.resultCode, RESULT_CODE);
            res.status = cast.enum(data?.status, STATUS);
            return res;
        };

        /**
         * Returns the available result codes for the profile data retrieval process.
         * @returns {typeof Fl64_Gpt_User_Shared_Web_Api_Update_Load.RESULT_CODE} A frozen object containing result codes.
         */
        this.getResultCodes = () => RESULT_CODE;
    }
}
