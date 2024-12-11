/**
 * Persistent DTO with metadata for the RDB entity: GPT User.
 * @namespace Fl64_Gpt_User_Back_Store_RDb_Schema_User
 */

// MODULE'S VARS

/**
 * Path to the entity in the plugin's DEM.
 *
 * @type {string}
 */
const ENTITY = '/fl64/gpt/user';

/**
 * Attribute mappings for the entity.
 * @memberOf Fl64_Gpt_User_Back_Store_RDb_Schema_User
 * @type {Object}
 */
const ATTR = {
    DATE_CREATED: 'date_created',
    EMAIL: 'email',
    LOCALE: 'locale',
    PASS_HASH: 'pass_hash',
    PASS_SALT: 'pass_salt',
    PIN: 'pin',
    STATUS: 'status',
    USER_REF: 'user_ref',
};
Object.freeze(ATTR);

// MODULE'S CLASSES

/**
 * DTO class representing the persistent structure of the GPT User entity.
 * @memberOf Fl64_Gpt_User_Back_Store_RDb_Schema_User
 */
class Dto {
    /**
     * The date when the user record was created.
     *
     * @type {Date}
     */
    date_created;

    /**
     * The user's email address.
     *
     * @type {string}
     */
    email;

    /**
     * User's preferred locale for interactions with the application (e.g., es-ES).
     *
     * @type {string}
     */
    locale;

    /**
     * Hash of the passphrase for user confirmation.
     *
     * @type {string}
     */
    pass_hash;

    /**
     * Salt used in hashing the passphrase.
     *
     * @type {string}
     */
    pass_salt;

    /**
     * PIN code for authentication, stored as an integer.
     *
     * @type {number}
     */
    pin;

    /**
     * Current status of the user account.
     *
     * @type {string}
     * @see Fl64_Gpt_User_Shared_Enum_User_Status
     */
    status;

    /**
     * Reference to the main user in the application.
     *
     * @type {number}
     */
    user_ref;
}

/**
 * Implements metadata and utility methods for the GPT User entity.
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class Fl64_Gpt_User_Back_Store_RDb_Schema_User {
    /**
     * Constructor for the GPT User persistent DTO class.
     *
     * @param {Fl64_Gpt_User_Back_Defaults} DEF - Default settings for the plugin.
     * @param {TeqFw_Core_Shared_Util_Cast} cast - Utility for type casting.
     * @param {typeof Fl64_Gpt_User_Shared_Enum_User_Status} STATUS - Enum for user statuses.
     */
    constructor(
        {
            Fl64_Gpt_User_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Util_Cast$: cast,
            'Fl64_Gpt_User_Shared_Enum_User_Status.default': STATUS,
        }
    ) {
        // INSTANCE METHODS

        /**
         * Creates a new DTO object with casted properties.
         *
         * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_User.Dto} [data] - Input data for the DTO.
         * @returns {Fl64_Gpt_User_Back_Store_RDb_Schema_User.Dto} - Casted DTO instance.
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.date_created = cast.date(data?.date_created);
            res.email = cast.string(data?.email);
            res.locale = cast.string(data?.locale);
            res.pass_hash = cast.string(data?.pass_hash);
            res.pass_salt = cast.string(data?.pass_salt);
            res.pin = cast.int(data?.pin);
            res.status = cast.enum(data?.status, STATUS);
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
        this.getPrimaryKey = () => [ATTR.USER_REF];
    }
}
