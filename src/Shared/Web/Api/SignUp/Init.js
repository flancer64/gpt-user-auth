/**
 * DTO for initiating the user sign-up process.
 * @namespace Fl64_Gpt_User_Shared_Web_Api_SignUp_Init
 */
// VARS
/**
 * @memberOf Fl64_Gpt_User_Shared_Web_Api_SignUp_Init
 */
const RESULT_CODE = {
    CONSENT_REQUIRED: 'CONSENT_REQUIRED',
    EMAIL_ALREADY_REGISTERED: 'EMAIL_ALREADY_REGISTERED',
    SERVER_ERROR: 'SERVER_ERROR',
    SUCCESS: 'SUCCESS',
};
Object.freeze(RESULT_CODE);

// CLASSES
/**
 * Request structure for initiating user registration.
 * @memberOf Fl64_Gpt_User_Shared_Web_Api_SignUp_Init
 */
class Request {
    /**
     * User's email address.
     * This email will be used for account verification and future communications.
     * The email must be in lowercase and should contain only the address part, without any display name.
     *
     * @type {string}
     * @example "user@example.com"
     * @example "customer123@domain.org"
     */
    email;

    /**
     * Consent flag indicating user's explicit agreement to data processing.
     * Registration cannot proceed without user consent.
     *
     * @type {boolean}
     * @example true // User has agreed to the data processing terms.
     * @example false // User has not agreed; registration should not proceed.
     */
    isConsent;

    /**
     * Secret passphrase chosen by the user for secure authentication.
     * This passphrase acts as a password and will be required for authentication in the application.
     * The passphrase can consist of multiple words to make it easier for users to input via voice interfaces.
     * It must be in lowercase, with no spaces at the beginning or end. Users should be encouraged to use
     * meaningful and easy-to-pronounce phrases.
     *
     * @type {string}
     * @example "sunny day morning" // A multi-word passphrase suitable for voice input.
     * @example "simplephrase" // A single-word passphrase.
     */
    passPhrase;
}

/**
 * Response structure for confirming the initiation of the registration process.
 * This class represents the data returned to the client after calling the
 * Fl64_Gpt_User_Shared_Web_Api_SignUp_Init endpoint.
 *
 * @memberOf Fl64_Gpt_User_Shared_Web_Api_SignUp_Init
 */
class Response {
    /**
     * Instructions for the user on the next steps to complete the registration process.
     * This property typically includes guidance on verifying their email and
     * securing their account.
     *
     * @type {string}
     * @example "Please verify your email address by clicking the link we sent to your email."
     */
    instructions;

    /**
     * A unique PIN code assigned to the user as their identifier.
     * The PIN code is generated during the registration process and will remain inactive
     * until the user's email address is verified. Users will use this PIN code in combination
     * with their passphrase for authentication.
     *
     * @type {number}
     * @example "123456"
     */
    pin;

    /**
     * Result code indicating the outcome of the registration initiation.
     *
     * @type {string}
     * @see Fl64_Gpt_User_Shared_Web_Api_SignUp_Init.RESULT_CODE
     */
    resultCode;
}


/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Fl64_Gpt_User_Shared_Web_Api_SignUp_Init {
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
         * Creates a request DTO for user registration initiation.
         * Ensures all properties are set to the correct type.
         *
         * @param {Fl64_Gpt_User_Shared_Web_Api_SignUp_Init.Request} [data]
         * @returns {Fl64_Gpt_User_Shared_Web_Api_SignUp_Init.Request}
         */
        this.createReq = function (data) {
            const req = new Request();
            req.email = cast.string(data?.email);
            req.isConsent = cast.booleanIfExists(data?.isConsent);
            req.passPhrase = cast.string(data?.passPhrase);
            return req;
        };

        /**
         * Creates a response DTO for the registration initiation process.
         * Sets a message providing information on the outcome of the registration initiation attempt.
         *
         * @param {Fl64_Gpt_User_Shared_Web_Api_SignUp_Init.Response} [data]
         * @returns {Fl64_Gpt_User_Shared_Web_Api_SignUp_Init.Response}
         */
        this.createRes = function (data) {
            const res = new Response();
            res.instructions = cast.string(data?.instructions);
            res.pin = cast.int(data?.pin);
            res.resultCode = cast.enum(data?.resultCode, RESULT_CODE);
            return res;
        };

        /**
         * Returns the available result codes for the operation.
         * @returns {typeof Fl64_Gpt_User_Shared_Web_Api_SignUp_Init.RESULT_CODE}
         */
        this.getResultCodes = () => RESULT_CODE;
    }
}
