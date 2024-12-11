/**
 * Persistent DTO with metadata for the RDB entity: GPT User Token.
 * @namespace Fl64_Gpt_User_Back_Store_RDb_Schema_Token
 */

// MODULE'S VARS

/**
 * Path to the entity in the plugin's DEM.
 *
 * @type {string}
 */
const ENTITY = '/fl64/gpt/token';

/**
 * Attribute mappings for the entity.
 * @memberOf Fl64_Gpt_User_Back_Store_RDb_Schema_Token
 * @type {Object}
 */
const ATTR = {
    CODE: 'code',
    DATE_CREATED: 'date_created',
    TYPE: 'type',
    USER_REF: 'user_ref',
};
Object.freeze(ATTR);

// MODULE'S CLASSES

/**
 * DTO class representing the persistent structure of the GPT User Token entity.
 * @memberOf Fl64_Gpt_User_Back_Store_RDb_Schema_Token
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
    date_created;

    /**
     * Type of activity for which the token is generated.
     * @type {string}
     */
    type;

    /**
     * Reference to the GPT user for whom this token is generated.
     * @type {number}
     */
    user_ref;
}

/**
 * Implements metadata and utility methods for the GPT User Token entity.
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class Fl64_Gpt_User_Back_Store_RDb_Schema_Token {
    /**
     * Constructor for the GPT User Token persistent DTO class.
     *
     * @param {Fl64_Gpt_User_Back_Defaults} DEF - Default settings for the plugin.
     * @param {TeqFw_Core_Shared_Util_Cast} cast - Utility for type casting.
     */
    constructor({Fl64_Gpt_User_Back_Defaults$: DEF, TeqFw_Core_Shared_Util_Cast$: cast}) {
        // INSTANCE METHODS

        /**
         * Creates a new DTO object with casted properties.
         *
         * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_Token.Dto} [data] - Input data for the DTO.
         * @returns {Fl64_Gpt_User_Back_Store_RDb_Schema_Token.Dto} - Casted DTO instance.
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.code = cast.string(data?.code);
            res.date_created = cast.date(data?.date_created);
            res.type = cast.string(data?.type);
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
        this.getPrimaryKey = () => [ATTR.CODE];
    }
}
