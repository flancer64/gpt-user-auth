/**
 *  Persistent DTO with metadata for the RDB entity: GPT User.
 *  @namespace Fl64_Gpt_User_Back_Store_RDb_Schema_User
 */
// MODULE'S VARS
/**
 * Path to the entity in plugin's DEM.
 * @type {string}
 */
const ENTITY = '/fl64/gpt/user';

/**
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
 * @memberOf Fl64_Gpt_User_Back_Store_RDb_Schema_User
 */
class Dto {
    /**
     * @type {Date}
     */
    date_created;
    /**
     * @type {string}
     */
    email;
    /**
     * @type {string}
     * User's preferred locale for interactions with the application (e.g., es-ES).
     */
    locale;
    /**
     * @type {string}
     * Hash of the passphrase for user confirmation.
     */
    pass_hash;
    /**
     * @type {string}
     * Salt used in hashing the passphrase.
     */
    pass_salt;
    /**
     * @type {number}
     * PIN code for authentication, stored as an integer.
     */
    pin;
    /**
     * @type {string}
     * @see Fl64_Gpt_User_Shared_Enum_User_Status
     */
    status;
    /**
     * Reference to the main user in the application.
     * @type {number}
     */
    user_ref;
}

// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class Fl64_Gpt_User_Back_Store_RDb_Schema_User {
    /**
     * @param {Fl64_Gpt_User_Back_Defaults} DEF
     * @param {TeqFw_Db_Back_RDb_Schema_EntityBase} base
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     * @param {typeof Fl64_Gpt_User_Shared_Enum_User_Status} STATUS
     */
    constructor(
        {
            Fl64_Gpt_User_Back_Defaults$: DEF,
            TeqFw_Db_Back_RDb_Schema_EntityBase$: base,
            TeqFw_Core_Shared_Util_Cast$: cast,
            Fl64_Gpt_User_Shared_Enum_User_Status$: STATUS,
        }
    ) {
        // INSTANCE METHODS
        /**
         * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_User.Dto} [data]
         * @returns {Fl64_Gpt_User_Back_Store_RDb_Schema_User.Dto}
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
         * Set JSDoc return type, real code is in `TeqFw_Db_Back_RDb_Schema_EntityBase`.
         * @returns {typeof Fl64_Gpt_User_Back_Store_RDb_Schema_User.ATTR}
         */
        this.getAttributes = function () {};

        // MAIN
        return base.create(this,
            `${DEF.NAME}${ENTITY}`,
            ATTR,
            [ATTR.USER_REF],
            Dto
        );
    }
}
