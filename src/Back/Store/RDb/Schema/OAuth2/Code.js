/**
 * Persistent DTO with metadata for the RDB entity: OAuth2 Authorization Code.
 * @namespace Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Code
 */

// MODULE'S VARS

/**
 * Path to the entity in the plugin's DEM.
 *
 * @type {string}
 */
const ENTITY = '/fl64/gpt/oauth/code';

/**
 * Attribute mappings for the entity.
 * @memberOf Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Code
 * @type {Object}
 */
const ATTR = {
    CLIENT_ID: 'client_id',
    CODE: 'code',
    DATE_CREATED: 'date_created',
    EXPIRES_AT: 'expires_at',
    ID: 'id',
    REDIRECT_URI: 'redirect_uri',
    SCOPE: 'scope',
    USER_ID: 'user_id',
};
Object.freeze(ATTR); // Ensure attribute mappings are immutable

// MODULE'S CLASSES

/**
 * DTO class representing the persistent structure of the OAuth2 Authorization Code entity.
 * @memberOf Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Code
 */
class Dto {
    /**
     * Primary key for the authorization code.
     *
     * @type {number}
     */
    id;

    /**
     * Generated authorization code.
     *
     * @type {string}
     */
    code;

    /**
     * Reference to the associated client.
     *
     * @type {number}
     */
    client_id;

    /**
     * Reference to the associated user.
     *
     * @type {number}
     */
    user_id;

    /**
     * Expiration time for the authorization code.
     *
     * @type {Date}
     */
    expires_at;

    /**
     * Redirect URI provided during authorization.
     *
     * @type {string}
     */
    redirect_uri;

    /**
     * Optional scopes granted for the authorization.
     *
     * @type {string|null}
     */
    scope;
}

/**
 * Implements metadata and utility methods for the OAuth2 Authorization Code entity.
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Code {
    /**
     * Constructor for the OAuth2 Authorization Code persistent DTO class.
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
         * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Code.Dto} [data] - Input data for the DTO.
         * @returns {Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Code.Dto} - Casted DTO instance.
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.id = cast.int(data?.id);
            res.code = cast.string(data?.code);
            res.client_id = cast.int(data?.client_id);
            res.user_id = cast.int(data?.user_id);
            res.expires_at = cast.date(data?.expires_at);
            res.redirect_uri = cast.string(data?.redirect_uri);
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
         * Returns the entity's path in the DEM with the plugin name prefix.
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
