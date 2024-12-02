/**
 * Persistent DTO with metadata for the RDB entity: OpenAI User.
 * @namespace Fl64_Gpt_User_Back_Store_RDb_Schema_Openai_User
 */
// MODULE'S VARS
/**
 * Path to the entity in plugin's DEM.
 *
 * @type {string}
 */
const ENTITY = '/fl64/gpt/openai/user';

/**
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

// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class Fl64_Gpt_User_Back_Store_RDb_Schema_Openai_User {
    /**
     * @param {Fl64_Gpt_User_Back_Defaults} DEF
     * @param {TeqFw_Db_Back_RDb_Schema_EntityBase} base
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     */
    constructor(
        {
            Fl64_Gpt_User_Back_Defaults$: DEF,
            TeqFw_Db_Back_RDb_Schema_EntityBase$: base,
            TeqFw_Core_Shared_Util_Cast$: cast,
        }
    ) {
        // INSTANCE METHODS
        /**
         * Creates a new DTO object with casted properties.
         *
         * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_Openai_User.Dto} [data]
         * @returns {Fl64_Gpt_User_Back_Store_RDb_Schema_Openai_User.Dto}
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
         * Set JSDoc return type, real code is in `TeqFw_Db_Back_RDb_Schema_EntityBase`.
         *
         * @returns {typeof Fl64_Gpt_User_Back_Store_RDb_Schema_Openai_User.ATTR}
         */
        this.getAttributes = function () {};

        // MAIN
        return base.create(this,
            `${DEF.NAME}${ENTITY}`,
            ATTR,
            [ATTR.USER_REF, ATTR.EPHEMERAL_ID],
            Dto
        );
    }
}
