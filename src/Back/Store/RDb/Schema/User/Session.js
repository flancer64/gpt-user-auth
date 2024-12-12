/**
 * Persistent DTO with metadata for the RDB entity: User Session.
 * @namespace Fl64_Gpt_User_Back_Store_RDb_Schema_User_Session
 */

// MODULE'S VARS

/**
 * Path to the entity in the plugin's DEM.
 *
 * @type {string}
 */
const ENTITY = '/fl64/gpt/user/session';

/**
 * Attribute mappings for the entity.
 * @memberOf Fl64_Gpt_User_Back_Store_RDb_Schema_User_Session
 * @type {Object}
 */
const ATTR = {
    DATE_CREATED: 'date_created',
    IP_ADDRESS: 'ip_address',
    SESSION_ID: 'session_id',
    USER_AGENT: 'user_agent',
    USER_REF: 'user_ref',
};
Object.freeze(ATTR);

// MODULE'S CLASSES

/**
 * DTO class representing the persistent structure of the User Session entity.
 * @memberOf Fl64_Gpt_User_Back_Store_RDb_Schema_User_Session
 */
class Dto {
    /**
     * The unique session identifier (UUID).
     *
     * @type {string}
     */
    session_id;

    /**
     * Reference to the user who owns the session.
     *
     * @type {number}
     */
    user_ref;

    /**
     * IP address from which the session was opened.
     *
     * @type {string}
     */
    ip_address;

    /**
     * Information about the client (browser, device).
     *
     * @type {string}
     */
    user_agent;

    /**
     * Timestamp of when the session was created.
     *
     * @type {Date}
     */
    date_created;
}

/**
 * Implements metadata and utility methods for the User Session entity.
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class Fl64_Gpt_User_Back_Store_RDb_Schema_User_Session {
    /**
     * Constructor for the User Session persistent DTO class.
     *
     * @param {Fl64_Gpt_User_Back_Defaults} DEF - Default settings for the plugin.
     * @param {TeqFw_Core_Shared_Util_Cast} cast - Utility for type casting.
     */
    constructor(
        {
            Fl64_Gpt_User_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Util_Cast$: cast,
        }
    ) {
        // INSTANCE METHODS

        /**
         * Creates a new DTO object with casted properties.
         *
         * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_User_Session.Dto} [data] - Input data for the DTO.
         * @returns {Fl64_Gpt_User_Back_Store_RDb_Schema_User_Session.Dto} - Casted DTO instance.
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.date_created = cast.date(data?.date_created);
            res.ip_address = cast.string(data?.ip_address);
            res.session_id = cast.string(data?.session_id);
            res.user_agent = cast.string(data?.user_agent);
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
        this.getPrimaryKey = () => [ATTR.SESSION_ID];
    }
}
