/**
 * Data Transfer Object (DTO) for the operation of sending a test email to the user's registered email address.
 * This namespace defines the request and response structures required for the operation.
 * It ensures proper data validation, authentication, and seamless integration between the API and the application logic.
 * Designed for use in scenarios where registered users test the integration or functionality of the email service.
 *
 * @namespace Fl64_Gpt_User_Shared_Web_Api_Test_Email
 */


// VARS
/**
 * Enum-like object defining the possible result codes for the email-sending operation.
 * These codes represent the status of the request and allow the application to determine
 * appropriate follow-up actions based on the outcome of the operation.
 *
 * @memberOf Fl64_Gpt_User_Shared_Web_Api_Test_Email
 * @enum {string}
 */
const RESULT_CODE = {
    /**
     * Indicates an internal server error occurred during the email-sending process.
     * The user should be notified to retry later.
     */
    SERVICE_ERROR: 'SERVICE_ERROR',

    /**
     * Indicates the email was successfully sent to the user's registered email address.
     * No further action is required.
     */
    SUCCESS: 'SUCCESS',

    /**
     * Indicates authentication failed due to incorrect PIN or passphrase.
     * The user should be prompted to verify their credentials and try again.
     */
    UNAUTHENTICATED: 'UNAUTHENTICATED',
};
Object.freeze(RESULT_CODE);


// CLASSES
/**
 * Request DTO for the email-sending service.
 * Defines the structure of the input data required for sending a test email to the user's registered email address.
 * PIN and passphrase are mandatory for authentication, while subject and message are optional.
 * If subject or message are not provided, the service will use default values.
 *
 * @memberOf Fl64_Gpt_User_Shared_Web_Api_Test_Email
 */
class Request {
    /**
     * The main content of the email to be sent.
     * Optional field. If omitted, the service will use a default message.
     *
     * @type {string|null}
     * @example "Hello, this is a test email from our application!"
     */
    message;

    /**
     * Passphrase used for authenticating the user.
     * Together with the PIN, it verifies the identity of the user making the request.
     * This field is mandatory.
     *
     * @type {string}
     * @example "my_secure_passphrase"
     */
    passPhrase;

    /**
     * Unique PIN assigned to the user during registration.
     * Serves as a numeric identifier for the user's account and is required for authentication.
     * This field is mandatory.
     *
     * @type {number}
     * @example 123456
     */
    pin;

    /**
     * The subject line of the email.
     * Provides a brief and meaningful description of the email's content.
     * Optional field. If omitted, the service will use a default subject.
     *
     * @type {string|null}
     * @example "Test Email"
     */
    subject;
}

/**
 * Response DTO for the email-sending service.
 * Defines the structure of the response data returned by the API.
 * Communicates the result of the email operation, both programmatically and through user-friendly instructions.
 *
 * @memberOf Fl64_Gpt_User_Shared_Web_Api_Test_Email
 */
class Response {
    /**
     * A human-readable message describing the outcome of the email operation.
     * The message provides context for the result and should be translated into the user's preferred language
     * before being presented to them.
     *
     * @type {string}
     * @example "The email was successfully sent to the user's registered address."
     */
    instructions;

    /**
     * A code representing the result of the email-sending operation.
     * This allows programmatic handling of the response, such as determining if further action is required.
     *
     * @type {string}
     * @see Fl64_Gpt_User_Shared_Web_Api_Test_Email.RESULT_CODE
     */
    resultCode;
}


/**
 * Service endpoint for the email-sending feature.
 * Implements the core API logic for sending messages to registered users.
 * Contains methods to handle request creation, response parsing, and result handling.
 *
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Fl64_Gpt_User_Shared_Web_Api_Test_Email {
    /**
     * Initializes the service with necessary utilities for type casting.
     *
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
        }
    ) {
        // INSTANCE METHODS

        /**
         * Creates a request DTO for sending a message.
         * Validates and structures user-provided data into a format understood by the API.
         *
         * @param {Fl64_Gpt_User_Shared_Web_Api_Test_Email.Request} [data] - User input data.
         * @returns {Fl64_Gpt_User_Shared_Web_Api_Test_Email.Request} - Structured request object.
         */
        this.createReq = function (data) {
            const req = new Request();
            req.message = cast.string(data?.message || null);
            req.passPhrase = cast.string(data?.passPhrase);
            req.pin = cast.int(data?.pin);
            req.subject = cast.string(data?.subject);
            return req;
        };

        /**
         * Creates a response DTO for the email operation.
         * Parses the API response into a structured format for easy processing.
         *
         * @param {Fl64_Gpt_User_Shared_Web_Api_Test_Email.Response} [data]
         * @returns {Fl64_Gpt_User_Shared_Web_Api_Test_Email.Response}
         */
        this.createRes = function (data) {
            const res = new Response();
            res.instructions = cast.string(data?.instructions);
            res.resultCode = cast.enum(data?.resultCode, RESULT_CODE);
            return res;
        };

        /**
         * Retrieves the available result codes for the email operation.
         * Provides an overview of possible outcomes for developers.
         *
         * @returns {typeof Fl64_Gpt_User_Shared_Web_Api_Test_Email.RESULT_CODE}
         */
        this.getResultCodes = () => RESULT_CODE;
    }
}

