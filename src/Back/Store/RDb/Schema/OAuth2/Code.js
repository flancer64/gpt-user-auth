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
    DATE_EXPIRED: 'date_expired',
    ID: 'id',
    REDIRECT_URI: 'redirect_uri',
    SCOPE: 'scope',
    USER_REF: 'user_ref',
};
Object.freeze(ATTR); // Ensure attribute mappings are immutable

// MODULE'S CLASSES

/**
 * DTO class representing the persistent structure of the OAuth2 Authorization Code entity.
 * @memberOf Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Code
 */
class Dto {
    /**
     * Reference to the associated client.
     *
     * @type {number}
     */
    client_id;

    /**
     * Generated authorization code.
     *
     * @type {string}
     */
    code;

    /**
     * Expiration time for the authorization code.
     *
     * @type {Date}
     */
    date_expired;

    /**
     * Primary key for the authorization code.
     *
     * @type {number}
     */
    id;

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

    /**
     * Reference to the associated user.
     *
     * @type {number}
     */
    user_ref;
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
            res.client_id = cast.int(data?.client_id);
            res.code = cast.string(data?.code);
            res.date_expired = cast.date(data?.date_expired);
            res.id = cast.int(data?.id);
            res.redirect_uri = cast.string(data?.redirect_uri);
            res.scope = cast.string(data?.scope);
            res.user_ref = cast.int(data?.user_ref);
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
