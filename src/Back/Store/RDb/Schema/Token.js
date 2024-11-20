/**
 * Persistent DTO with metadata for the RDB entity: GPT User Token.
 * @namespace Fl64_Gpt_User_Back_Store_RDb_Schema_Token
 */
// MODULE'S VARS
/**
 * Path to the entity in plugin's DEM.
 * @type {string}
 */
const ENTITY = '/fl64/gpt/token';

/**
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

// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class Fl64_Gpt_User_Back_Store_RDb_Schema_Token {
    /**
     * @param {Fl64_Gpt_User_Back_Defaults} DEF
     * @param {TeqFw_Db_Back_RDb_Schema_EntityBase} base
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     */
    constructor(
        {
            Fl64_Gpt_User_Back_Defaults$: DEF,
            TeqFw_Db_Back_RDb_Schema_EntityBase$: base,
            TeqFw_Core_Shared_Util_Cast$: cast
        }
    ) {
        // INSTANCE METHODS
        /**
         * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_Token.Dto} [data]
         * @returns {Fl64_Gpt_User_Back_Store_RDb_Schema_Token.Dto}
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
         * Set JSDoc return type, real code is in `TeqFw_Db_Back_RDb_Schema_EntityBase`.
         * @returns {typeof Fl64_Gpt_User_Back_Store_RDb_Schema_Token.ATTR}
         */
        this.getAttributes = function () {};

        // MAIN
        return base.create(this,
            `${DEF.NAME}${ENTITY}`,
            ATTR,
            [ATTR.CODE],
            Dto
        );
    }
}
