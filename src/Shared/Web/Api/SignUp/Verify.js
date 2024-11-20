/**
 * DTO for verifying the user's email during sign-up.
 * @namespace Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify
 */

// VARS
/**
 * @memberOf Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify
 */
export const ResultCode = {
    INVALID_TOKEN: 'INVALID_TOKEN', // The provided verification token is invalid or has expired
    SUCCESS: 'SUCCESS', // Verification was successful, and the user's email has been confirmed
    USER_NOT_FOUND: 'USER_NOT_FOUND' // The user associated with the verification token could not be found
};
Object.freeze(ResultCode);

// CLASSES
/**
 * @memberOf Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify
 */
class Request {
    /**
     * Verification token sent to the user's email.
     * @type {string}
     */
    token;
}

/**
 * @memberOf Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify
 */
class Response {
    /**
     * Date when the user registered.
     * @type {Date}
     */
    dateCreated;

    /**
     * User's email address.
     * @type {string}
     */
    email;

    /**
     * Verification status message.
     * @type {string}
     */
    message;

    /**
     * Generated PIN code for user's authentication.
     * @type {number}
     */
    pin;

    /**
     * Code indicating the result of the verification process.
     * @type {string}
     * @see Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify.ResultCode
     */
    resultCode;

    /**
     * Current status of the user account.
     * @type {string}
     * @see Fl64_Gpt_User_Shared_Enum_OpenAI_User_Status
     */
    status;
}

/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify {
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
         * Creates a request DTO for email verification.
         * @param {Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify.Request} [data]
         * @returns {Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify.Request}
         */
        this.createReq = function (data) {
            const req = new Request();
            req.token = cast.string(data?.token);
            return req;
        };

        /**
         * Creates a response DTO for email verification.
         * @param {Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify.Response} [data]
         * @returns {Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify.Response}
         */
        this.createRes = function (data) {
            const res = new Response();
            res.dateCreated = cast.date(data?.dateCreated);
            res.email = cast.string(data?.email);
            res.message = cast.string(data?.message);
            res.pin = cast.int(data?.pin);
            res.resultCode = cast.enum(data?.resultCode, ResultCode);
            res.status = cast.string(data?.status);
            return res;
        };
    }
}
