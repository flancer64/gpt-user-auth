/**
 * The OpenAI token data structure for Business Logic (Domain DTO).
 */

// MODULE'S CLASSES
/**
 * @memberOf Fl64_Gpt_User_Shared_Dto_Token
 */
class Dto {
    /**
     * One-time code generated for the specified activity.
     * @type {string}
     */
    code;

    /**
     * Date and time when the token was generated.
     * @type {Date}
     */
    dateCreated;

    /**
     * Type of activity for which the token is generated.
     * @type {string}
     */
    type;

    /**
     * Reference to the GPT user for whom this token is generated.
     * @type {number}
     */
    userRef;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Fl64_Gpt_User_Shared_Dto_Token {
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
         * @param {Fl64_Gpt_User_Shared_Dto_Token.Dto} [data]
         * @returns {Fl64_Gpt_User_Shared_Dto_Token.Dto}
         */
        this.createDto = function (data) {
            // Create new DTO and populate with initial data
            const res = Object.assign(new Dto(), data);

            // Cast known attributes
            res.code = cast.string(data?.code);
            res.dateCreated = cast.date(data?.dateCreated);
            res.type = cast.string(data?.type);
            res.userRef = cast.int(data?.userRef);

            return res;
        };
    }
}
