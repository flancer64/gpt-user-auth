/**
 * The OAuth2 token data structure for Business Logic (Domain DTO).
 * @namespace Fl64_Gpt_User_Shared_Dto_OAuth2_Token
 */

// MODULE'S CLASSES

/**
 * @memberOf Fl64_Gpt_User_Shared_Dto_OAuth2_Token
 */
class Dto {
    /**
     * Unique identifier of the token.
     * @type {number}
     */
    id;

    /**
     * Access token for authentication.
     * @type {string}
     */
    accessToken;

    /**
     * Optional refresh token for renewing access tokens.
     * @type {string|null}
     */
    refreshToken;

    /**
     * Reference to the associated client.
     * @type {number}
     */
    clientRef;

    /**
     * Reference to the associated user.
     * @type {number}
     */
    userRef;

    /**
     * Expiration date and time for the access token.
     * @type {Date}
     */
    dateExpire;

    /**
     * Optional scope defining access permissions.
     * @type {string|null}
     */
    scope;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Fl64_Gpt_User_Shared_Dto_OAuth2_Token {
    /**
     * Constructor for the OAuth2 Token domain DTO factory.
     *
     * @param {TeqFw_Core_Shared_Util_Cast} cast - Utility for type casting.
     */
    constructor({TeqFw_Core_Shared_Util_Cast$: cast}) {
        // INSTANCE METHODS

        /**
         * Create a new DTO and populate it with initialization data.
         * @param {Fl64_Gpt_User_Shared_Dto_OAuth2_Token.Dto} [data]
         * @returns {Fl64_Gpt_User_Shared_Dto_OAuth2_Token.Dto}
         */
        this.createDto = function (data) {
            // Create new DTO and populate with initial data
            const res = Object.assign(new Dto(), data);

            // Cast known attributes
            res.id = cast.int(data?.id);
            res.accessToken = cast.string(data?.accessToken);
            res.refreshToken = cast.string(data?.refreshToken);
            res.clientRef = cast.int(data?.clientRef);
            res.userRef = cast.int(data?.userRef);
            res.dateExpire = cast.date(data?.dateExpire);
            res.scope = cast.string(data?.scope);

            return res;
        };
    }
}
