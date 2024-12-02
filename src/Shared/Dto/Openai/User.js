/**
 * The OpenAI user data structure for Business Logic (Domain DTO).
 */

// MODULE'S CLASSES
/**
 * @memberOf Fl64_Gpt_User_Shared_Dto_Openai_User
 */
class Dto {
    /**
     * Code associated with the OpenAI user for identification or authorization.
     * @type {string}
     */
    code;
    /**
     * Date and time when the OpenAI user record was created.
     * @type {Date}
     */
    dateCreated;
    /**
     * Date and time of the last interaction or update for the OpenAI user.
     * @type {Date}
     */
    dateLast;
    /**
     * Reference to the main user in the application.
     * @type {number}
     */
    userRef;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Fl64_Gpt_User_Shared_Dto_Openai_User {
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
         * Create a new DTO and populate it with initialization data.
         * @param {Fl64_Gpt_User_Shared_Dto_Openai_User.Dto} [data]
         * @returns {Fl64_Gpt_User_Shared_Dto_Openai_User.Dto}
         */
        this.createDto = function (data) {
            // Create new DTO and populate with initial data
            const res = Object.assign(new Dto(), data);

            // Cast known attributes
            res.code = cast.string(data?.code);
            res.dateCreated = cast.date(data?.dateCreated);
            res.dateLast = cast.date(data?.dateLast);
            res.userRef = cast.int(data?.userRef);

            return res;
        };
    }
}
