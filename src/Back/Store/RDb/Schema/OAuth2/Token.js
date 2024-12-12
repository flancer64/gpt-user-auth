/**
 * Persistent DTO with metadata for the RDB entity: OAuth2 Token.
 * @namespace Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Token
 */

// MODULE'S VARS

/**
 * Path to the entity in the plugin's DEM.
 *
 * @type {string}
 */
const ENTITY = '/fl64/gpt/oauth/token';

/**
 * Attribute mappings for the entity.
 * @memberOf Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Token
 * @type {Object}
 */
const ATTR = {
    ID: 'id',
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    CLIENT_REF: 'client_ref',
    USER_REF: 'user_ref',
    DATE_EXPIRE: 'date_expire',
    SCOPE: 'scope'
};
Object.freeze(ATTR);

// MODULE'S CLASSES

/**
 * DTO class representing the persistent structure of the OAuth2 Token entity.
 * @memberOf Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Token
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
    access_token;

    /**
     * Optional refresh token for renewing access tokens.
     * @type {string|null}
     */
    refresh_token;

    /**
     * Reference to the associated client.
     * @type {number}
     */
    client_ref;

    /**
     * Reference to the associated user.
     * @type {number}
     */
    user_ref;

    /**
     * Expiration date and time for the access token.
     * @type {Date}
     */
    date_expire;

    /**
     * Optional scope defining access permissions.
     * @type {string|null}
     */
    scope;
}

/**
 * Implements metadata and utility methods for the OAuth2 Token entity.
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Token {
    /**
     * Constructor for the OAuth2 Token persistent DTO class.
     *
     * @param {Fl64_Gpt_User_Back_Defaults} DEF - Default settings for the plugin.
     * @param {TeqFw_Core_Shared_Util_Cast} cast - Utility for type casting.
     */
    constructor(
        {
            Fl64_Gpt_User_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Util_Cast$: cast
        }
    ) {
        // INSTANCE METHODS

        /**
         * Creates a new DTO object with casted properties.
         *
         * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Token.Dto} [data] - Input data for the DTO.
         * @returns {Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Token.Dto} - Casted DTO instance.
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.id = cast.int(data?.id);
            res.access_token = cast.string(data?.access_token);
            res.refresh_token = cast.string(data?.refresh_token);
            res.client_ref = cast.int(data?.client_ref);
            res.user_ref = cast.int(data?.user_ref);
            res.date_expire = cast.date(data?.date_expire);
            res.scope = cast.string(data?.scope);
            return res;
        };

        /**
         * Returns the attribute map for the entity.
         *
         * @returns {Object}
         */
        this.getAttributes = () => ATTR;

        /**
         * Returns the entity's path in the DEM.
         *
         * @returns {string}
         */
        this.getEntityName = () => `${DEF.NAME}${ENTITY}`;

        /**
         * Returns the primary key attributes for the entity.
         *
         * @returns {Array<string>}
         */
        this.getPrimaryKey = () => [ATTR.ID];
    }
}
