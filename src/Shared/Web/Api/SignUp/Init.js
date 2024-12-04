/**
 * DTOs for initiating the user sign-up process in the web application.
 * This service collects user-provided data (email, consent, locale, and passphrase),
 * validates the email, and creates a user record with a "pending verification" status.
 * A PIN is generated, and an email with a verification token is sent to the user.
 *
 * @namespace Fl64_Gpt_User_Shared_Web_Api_SignUp_Init
 */

// VARS
/**
 * Result codes for the user sign-up initiation process.
 *
 * @memberOf Fl64_Gpt_User_Shared_Web_Api_SignUp_Init
 * @enum {string}
 */
const RESULT_CODE = {
    /** User's consent for data processing is required. */
    CONSENT_REQUIRED: 'CONSENT_REQUIRED',

    /** The provided email address is already registered. */
    EMAIL_ALREADY_REGISTERED: 'EMAIL_ALREADY_REGISTERED',

    /** A server error occurred during the registration process. */
    SERVER_ERROR: 'SERVER_ERROR',

    /** The sign-up process completed successfully. */
    SUCCESS: 'SUCCESS',
};
Object.freeze(RESULT_CODE);


// CLASSES
/**
 * Request structure for initiating user registration.
 *
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
     * Consent flag indicating the user's explicit agreement to data processing.
     * This flag must be set to `true` for the registration process to proceed.
     * Sending a request with `isConsent=false` is invalid and will be rejected.
     *
     * @type {boolean}
     * @example true // The user has agreed to the data processing terms.
     */
    isConsent;

    /**
     * User's preferred locale for interactions with the application.
     * This value will be used to determine the language and formatting settings for the user interface.
     * It must conform to BCP 47 language tags.
     *
     * @type {string}
     * @example "en-US" // English (United States).
     * @example "ru-RU" // Russian (Russia).
     */
    locale;

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
 * Returned by the Fl64_Gpt_User_Shared_Web_Api_SignUp_Init endpoint.
 *
 * @memberOf Fl64_Gpt_User_Shared_Web_Api_SignUp_Init
 */
class Response {
    /**
     * Instructions for the user on the next steps to complete the registration process.
     * Typically includes guidance for email verification and securing the account.
     * The instructions are in English by default but must be translated into the user's preferred language
     * as specified during the registration process.
     *
     * @type {string}
     * @example "Please verify your email address by clicking the link we sent to your email."
     */
    instructions;

    /**
     * A unique PIN code assigned to the user during registration.
     * The PIN remains inactive until the user's email is verified.
     * Users will use this PIN along with their passphrase for authentication.
     * The chat must store both the PIN and the passphrase for future user authentication.
     *
     * @type {number}
     * @example 123456
     */
    pin;

    /**
     * Result code indicating the outcome of the registration initiation process.
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
            req.locale = cast.string(data?.locale);
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
