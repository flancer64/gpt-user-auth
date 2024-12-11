/**
 * Persistent DTO with metadata for the RDB entity: OpenAI User.
 * @namespace Fl64_Gpt_User_Back_Store_RDb_Schema_Openai_User
 */

// MODULE'S VARS

/**
 * Path to the entity in the plugin's DEM.
 *
 * @type {string}
 */
const ENTITY = '/fl64/gpt/openai/user';

/**
 * Attribute mappings for the entity.
 * @memberOf Fl64_Gpt_User_Back_Store_RDb_Schema_Openai_User
 * @type {Object}
 */
const ATTR = {
    DATE_CREATED: 'date_created',
    DATE_LAST: 'date_last',
    EPHEMERAL_ID: 'ephemeral_id',
    USER_REF: 'user_ref',
};
Object.freeze(ATTR);

// MODULE'S CLASSES

/**
 * DTO class representing the persistent structure of the OpenAI User entity.
 * @memberOf Fl64_Gpt_User_Back_Store_RDb_Schema_Openai_User
 */
class Dto {
    /**
     * The date when the OpenAI user record was created.
     *
     * @type {Date}
     */
    date_created;

    /**
     * The date of the last interaction or update.
     *
     * @type {Date}
     */
    date_last;

    /**
     * Code associated with the OpenAI user for identification or authorization.
     *
     * @type {string}
     */
    ephemeral_id;

    /**
     * Reference to the main user in the application.
     *
     * @type {number}
     */
    user_ref;
}

/**
 * Implements metadata and utility methods for the OpenAI User entity.
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class Fl64_Gpt_User_Back_Store_RDb_Schema_Openai_User {
    /**
     * Constructor for the OpenAI User persistent DTO class.
     *
     * @param {Fl64_Gpt_User_Back_Defaults} DEF - Default settings for the plugin.
     * @param {TeqFw_Core_Shared_Util_Cast} cast - Utility for type casting.
     */
    constructor({Fl64_Gpt_User_Back_Defaults$: DEF, TeqFw_Core_Shared_Util_Cast$: cast}) {
        // INSTANCE METHODS

        /**
         * Creates a new DTO object with casted properties.
         *
         * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_Openai_User.Dto} [data] - Input data for the DTO.
         * @returns {Fl64_Gpt_User_Back_Store_RDb_Schema_Openai_User.Dto} - Casted DTO instance.
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.date_created = cast.date(data?.date_created);
            res.date_last = cast.date(data?.date_last);
            res.ephemeral_id = cast.string(data?.ephemeral_id);
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
        this.getPrimaryKey = () => [ATTR.USER_REF, ATTR.EPHEMERAL_ID];
    }
}
