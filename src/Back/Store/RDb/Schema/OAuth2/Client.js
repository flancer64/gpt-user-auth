/**
 * Persistent DTO with metadata for the RDB entity: OAuth2 Client.
 * @namespace Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Client
 */

// MODULE'S VARS

/**
 * Path to the entity in the plugin's DEM.
 *
 * @type {string}
 */
const ENTITY = '/fl64/gpt/oauth/client';

/**
 * Attribute mappings for the entity.
 * @memberOf Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Client
 * @type {Object}
 */
const ATTR = {
    CLIENT_ID: 'client_id',
    CLIENT_SECRET: 'client_secret',
    DATE_CREATED: 'date_created',
    ID: 'id',
    NAME: 'name',
    REDIRECT_URI: 'redirect_uri',
    STATUS: 'status',
};
Object.freeze(ATTR);

// MODULE'S CLASSES

/**
 * DTO class representing the persistent structure of the OAuth2 Client entity.
 * @memberOf Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Client
 */
class Dto {
    /**
     * Unique identifier for the client.
     *
     * @type {number}
     */
    id;

    /**
     * Unique identifier for the client, used during authorization.
     *
     * @type {string}
     */
    client_id;

    /**
     * Secret key assigned to the client for secure communication.
     *
     * @type {string}
     */
    client_secret;

    /**
     * Authorized redirect URI for the client.
     *
     * @type {string}
     */
    redirect_uri;

    /**
     * Human-readable name of the client.
     *
     * @type {string}
     */
    name;

    /**
     * Status of the client registration.
     *
     * @type {string}
     * @see Fl64_Gpt_User_Shared_Enum_OAuth2_Client_Status
     */
    status;

    /**
     * Date and time when the client was registered.
     *
     * @type {Date}
     */
    date_created;
}

/**
 * Implements metadata and utility methods for the OAuth2 Client entity.
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Client {
    /**
     * Constructor for the OAuth2 Client persistent DTO class.
     *
     * @param {Fl64_Gpt_User_Back_Defaults} DEF - Default settings for the plugin.
     * @param {TeqFw_Core_Shared_Util_Cast} cast - Utility for type casting.
     * @param {typeof Fl64_Gpt_User_Shared_Enum_OAuth2_Client_Status} STATUS - Enum for client statuses.
     */
    constructor(
        {
            Fl64_Gpt_User_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Util_Cast$: cast,
            'Fl64_Gpt_User_Shared_Enum_OAuth2_Client_Status.default': STATUS,
        }
    ) {
        // INSTANCE METHODS

        /**
         * Creates a new DTO object with casted properties.
         *
         * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Client.Dto} [data] - Input data for the DTO.
         * @returns {Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Client.Dto} - Casted DTO instance.
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.client_id = cast.string(data?.client_id);
            res.client_secret = cast.string(data?.client_secret);
            res.date_created = cast.date(data?.date_created);
            res.id = cast.int(data?.id);
            res.name = cast.string(data?.name);
            res.redirect_uri = cast.string(data?.redirect_uri);
            res.status = cast.enum(data?.status, STATUS);
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
