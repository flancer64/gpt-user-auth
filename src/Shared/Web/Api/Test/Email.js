/**
 * Data Transfer Object (DTO) for sending a message to the user's registered email.
 * This structure defines the request and response formats for the email-sending operation.
 * It serves as a bridge between the API and the calling application logic.
 * @namespace Fl64_Gpt_User_Shared_Web_Api_Test_Email
 */

// VARS
/**
 * Enum-like object defining possible result codes for the email sending operation.
 * These result codes indicate the success or failure of the operation and help
 * the consuming application to handle the response appropriately.
 * @memberOf Fl64_Gpt_User_Shared_Web_Api_Test_Email
 */
const RESULT_CODE = {
    SERVICE_ERROR: 'SERVICE_ERROR', // Internal server error occurred during the email sending process.
    SUCCESS: 'SUCCESS', // Email was successfully sent to the user's registered email address.
    UNAUTHENTICATED: 'UNAUTHENTICATED', // Authentication failed due to incorrect PIN or pass phrase.
};
Object.freeze(RESULT_CODE);

// CLASSES
/**
 * Request DTO for the email sending service.
 * Defines the structure of the input data required for sending an email.
 * All fields must be properly validated before passing to the service.
 * @memberOf Fl64_Gpt_User_Shared_Web_Api_Test_Email
 */
class Request {
    /**
     * Passphrase used for user authentication.
     * Together with the PIN, this verifies the identity of the user making the request.
     * @type {string}
     * @example "my_secure_passphrase"
     */
    passPhrase;

    /**
     * Unique PIN assigned to the user during registration.
     * Serves as a numeric identifier for the user's account.
     * @type {number}
     * @example 123456
     */
    pin;

    /**
     * Main body of the email to be sent.
     * Optional, can be omitted if the subject alone provides sufficient context.
     * @type {string|null}
     * @example "Hello, this is a test email from our application!"
     */
    message;

    /**
     * Subject line for the email.
     * Provides a brief and meaningful description of the email's content.
     * This field is mandatory to ensure proper communication.
     * @type {string}
     * @example "Test Email"
     */
    subject;
}

/**
 * Response DTO for the email sending service.
 * Defines the structure of the response data returned by the API.
 * It communicates the result of the operation to the calling application.
 * @memberOf Fl64_Gpt_User_Shared_Web_Api_Test_Email
 */
class Response {
    /**
     * Human-readable status message describing the outcome of the email operation.
     * Helps the application or user understand what happened during the process.
     * @type {string}
     * @example "The email was successfully sent to the user's registered address."
     */
    instructions;

    /**
     * Code representing the result of the email sending operation.
     * Helps programmatically determine the success or failure of the process.
     * @type {string}
     * @see Fl64_Gpt_User_Shared_Web_Api_Test_Email.RESULT_CODE
     */
    resultCode;
}

/**
 * Service endpoint for the email-sending feature.
 * Implements the core API logic for sending messages to registered users.
 * Contains methods to handle request creation, response parsing, and result handling.
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Fl64_Gpt_User_Shared_Web_Api_Test_Email {
    /**
     * Initializes the service with necessary utilities for type casting.
     * @param {TeqFw_Core_Shared_Util_Cast} cast - Utility for safe type conversion.
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
         * Fields like `message` are optional, while `subject` remains required.
         * @param {Fl64_Gpt_User_Shared_Web_Api_Test_Email.Request} [data] - User input data.
         * @returns {Fl64_Gpt_User_Shared_Web_Api_Test_Email.Request} - Structured request object.
         */
        this.createReq = function (data) {
            const req = new Request();
            req.message = cast.string(data?.message || null); // Optional: Email body.
            req.passPhrase = cast.string(data?.passPhrase); // Required: Passphrase for authentication.
            req.pin = cast.int(data?.pin); // Required: PIN for user identification.
            req.subject = cast.string(data?.subject); // Required: Email subject.
            return req;
        };

        /**
         * Creates a response DTO for the email operation.
         * Parses the API response into a structured format for easy processing.
         * @param {Fl64_Gpt_User_Shared_Web_Api_Test_Email.Response} [data] - API response data.
         * @returns {Fl64_Gpt_User_Shared_Web_Api_Test_Email.Response} - Parsed response object.
         */
        this.createRes = function (data) {
            const res = new Response();
            res.instructions = cast.string(data?.instructions); // Feedback message for the operation.
            res.resultCode = cast.enum(data?.resultCode, RESULT_CODE); // Outcome of the operation.
            return res;
        };

        /**
         * Retrieves the available result codes for the email operation.
         * Helps developers understand possible outcomes when interacting with the API.
         * @returns {typeof Fl64_Gpt_User_Shared_Web_Api_Test_Email.RESULT_CODE} - Defined result codes.
         */
        this.getResultCodes = () => RESULT_CODE;
    }
}
