/**
 * Domain DTO for OAuth2 Authorization Code.
 * Represents the structure used in the business logic of the application.
 */

// MODULE'S CLASSES
/**
 * @memberOf Fl64_Gpt_User_Shared_Dto_OAuth2_Code
 */
class Dto {
    /**
     * Generated authorization code.
     * @type {string}
     */
    code;

    /**
     * Reference to the associated client.
     * @type {number}
     */
    clientRef;

    /**
     * Expiration time for the authorization code.
     * @type {Date}
     */
    dateExpired;

    /**
     * Primary key for the authorization code.
     * @type {number}
     */
    id;

    /**
     * Redirect URI provided during authorization.
     * @type {string}
     */
    redirectUri;

    /**
     * Optional scopes granted for the authorization.
     * @type {string|null}
     */
    scope;

    /**
     * Reference to the associated user.
     * @type {number}
     */
    userRef;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Fl64_Gpt_User_Shared_Dto_OAuth2_Code {
    /**
     * Constructor for the domain DTO factory.
     *
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     */
    constructor({TeqFw_Core_Shared_Util_Cast$: cast}) {
        /**
         * Creates a new DTO and populates it with initialization data.
         * @param {Fl64_Gpt_User_Shared_Dto_OAuth2_Code.Dto} [data]
         * @returns {Fl64_Gpt_User_Shared_Dto_OAuth2_Code.Dto}
         */
        this.createDto = function (data) {
            // Create a new DTO and populate with initial data
            const res = Object.assign(new Dto(), data);

            // Cast known attributes
            res.clientRef = cast.int(data?.clientRef);
            res.code = cast.string(data?.code);
            res.dateExpired = cast.date(data?.dateExpired);
            res.id = cast.int(data?.id);
            res.redirectUri = cast.string(data?.redirectUri);
            res.scope = cast.string(data?.scope);
            res.userRef = cast.int(data?.userRef);

            return res;
        };
    }
}
