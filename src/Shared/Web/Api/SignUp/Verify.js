/**
 * DTO for verifying the user's email during sign-up.
 * @namespace Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify
 */

// VARS
/**
 * @memberOf Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify
 */
const RESULT_CODE = {
    INVALID_TOKEN: 'INVALID_TOKEN', // The provided verification token is invalid or has expired.
    SUCCESS: 'SUCCESS', // Verification was successful, and the user's email has been confirmed.
    USER_NOT_FOUND: 'USER_NOT_FOUND' // The user associated with the verification token could not be found.
};
Object.freeze(RESULT_CODE);

// CLASSES
/**
 * Request structure for verifying the user's email.
 * @memberOf Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify
 */
class Request {
    /**
     * Verification token sent to the user's email.
     * The token is a unique identifier for confirming the user's email address.
     *
     * @type {string}
     * @example "abc123xyz456" // Example token sent to the user via email.
     */
    token;
}

/**
 * Response structure for confirming the email verification process.
 * This class represents the data returned to the client after calling the
 * Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify endpoint.
 *
 * @memberOf Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify
 */
class Response {
    /**
     * Date when the user registered.
     * This helps track the creation timestamp for audit or informational purposes.
     *
     * @type {Date}
     * @example "2023-12-25T12:34:56Z" // ISO 8601 formatted date-time string.
     */
    dateCreated;

    /**
     * User's email address.
     * This confirms the email address that was verified.
     *
     * @type {string}
     * @example "user@example.com"
     */
    email;

    /**
     * User's preferred locale for application interactions.
     * This locale is used to configure the application interface and communications for the user.
     * It must conform to BCP 47 language tags.
     *
     * @type {string}
     * @example "en-US" // English (United States).
     * @example "ru-RU" // Russian (Russia).
     */
    locale;

    /**
     * Instructions for the user on their next steps.
     * Typically includes guidance on how to complete their registration or use the application.
     *
     * @type {string}
     * @example "You can now log in using your email and passphrase."
     */
    instructions;

    /**
     * A unique PIN code assigned to the user.
     * This PIN is generated during registration and used for secure authentication.
     *
     * @type {number}
     * @example 123456
     */
    pin;

    /**
     * Result code indicating the outcome of the verification process.
     * Provides feedback on whether the verification succeeded or failed.
     *
     * @type {string}
     * @see Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify.RESULT_CODE
     */
    resultCode;

    /**
     * Current status of the user account after verification.
     * Indicates whether the account is active, pending, or deactivated.
     *
     * @type {string}
     * @example "ACTIVE" // Account is active and ready for use.
     * @example "PENDING" // Account is still pending further actions.
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
            TeqFw_Core_Shared_Util_Cast$: cast
        }
    ) {
        // INSTANCE METHODS

        /**
         * Creates a request DTO for email verification.
         * Ensures the input token is correctly cast to a string.
         *
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
         * Ensures all response properties are properly cast to their expected types.
         *
         * @param {Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify.Response} [data]
         * @returns {Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify.Response}
         */
        this.createRes = function (data) {
            const res = new Response();
            res.dateCreated = cast.date(data?.dateCreated);
            res.email = cast.string(data?.email);
            res.locale = cast.string(data?.locale);
            res.instructions = cast.string(data?.instructions);
            res.pin = cast.int(data?.pin);
            res.resultCode = cast.enum(data?.resultCode, RESULT_CODE);
            res.status = cast.string(data?.status);
            return res;
        };

        /**
         * Returns the available result codes for the operation.
         * @returns {typeof Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify.RESULT_CODE}
         */
        this.getResultCodes = () => RESULT_CODE;
    }
}
