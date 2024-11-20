/**
 * The OpenAI user data structure for Business Logic (Domain DTO).
 */

// MODULE'S CLASSES
/**
 * @memberOf Fl64_Gpt_User_Shared_Dto_User
 */
class Dto {
    /**
     * Date and time when the user record was created.
     * @type {Date}
     */
    dateCreated;
    /**
     * User's email address.
     * @type {string}
     */
    email;
    /**
     * Hash of the passphrase for user confirmation.
     * @type {string}
     */
    passHash;
    /**
     * Salt used in hashing the passphrase.
     * @type {string}
     */
    passSalt;
    /**
     * PIN code for authentication, stored as an integer.
     * @type {number}
     */
    pin;
    /**
     * Status of the user account (e.g., ACTIVE, BLOCKED).
     * @type {string}
     * @see Fl64_Gpt_User_Shared_Enum_User_Status
     */
    status;
    /**
     * Reference to the main user in the application.
     * @type {number}
     */
    userRef;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Fl64_Gpt_User_Shared_Dto_User {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     * @param {typeof Fl64_Gpt_User_Shared_Enum_User_Status} STATUS
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
            'Fl64_Gpt_User_Shared_Enum_User_Status.default': STATUS,
        }
    ) {
        // INSTANCE METHODS
        /**
         * Create a new DTO and populate it with initialization data.
         * @param {Fl64_Gpt_User_Shared_Dto_User.Dto} [data]
         * @returns {Fl64_Gpt_User_Shared_Dto_User.Dto}
         */
        this.createDto = function (data) {
            // Create new DTO and populate with initial data
            const res = Object.assign(new Dto(), data);

            // Cast known attributes
            res.dateCreated = cast.date(data?.dateCreated);
            res.email = cast.string(data?.email);
            res.passHash = cast.string(data?.passHash);
            res.passSalt = cast.string(data?.passSalt);
            res.pin = cast.int(data?.pin);
            res.status = cast.enum(data?.status, STATUS);
            res.userRef = cast.int(data?.userRef);

            return res;
        };
    }
}
