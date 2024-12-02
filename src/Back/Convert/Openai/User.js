/**
 * Converts Domain DTO to/from related DTOs (Persistent, etc.) for OpenAI User.
 * @implements TeqFw_Core_Back_Api_Convert
 */
export default class Fl64_Gpt_User_Back_Convert_Openai_User {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     * @param {Fl64_Gpt_User_Shared_Dto_Openai_User} domDto
     * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_Openai_User} rdbDto
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
            Fl64_Gpt_User_Shared_Dto_Openai_User$: domDto,
            Fl64_Gpt_User_Back_Store_RDb_Schema_Openai_User$: rdbDto,
        }
    ) {
        // INSTANCE METHODS

        /**
         * Converts the persistent DTO (RDB) to the domain DTO.
         * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_Openai_User.Dto} dbUser
         * @returns {Fl64_Gpt_User_Shared_Dto_Openai_User.Dto}
         */
        this.db2dom = function ({dbUser}) {
            const res = domDto.createDto();
            res.code = cast.string(dbUser?.code);
            res.dateCreated = cast.date(dbUser?.date_created);
            res.dateLast = cast.date(dbUser?.date_last);
            res.userRef = cast.int(dbUser?.user_ref);
            return res;
        };

        /**
         * The structure of the returned value.
         * @typedef {Object} Dom2RdbResult
         * @property {Fl64_Gpt_User_Back_Store_RDb_Schema_Openai_User.Dto} dbUser
         * @memberof Fl64_Gpt_User_Back_Convert_Openai_User
         */

        /**
         * Converts the domain DTO to the persistent DTO (RDB).
         * @param {Fl64_Gpt_User_Shared_Dto_Openai_User.Dto} user
         * @returns {Dom2RdbResult}
         */
        this.dom2db = function ({user}) {
            const dbUser = rdbDto.createDto();
            dbUser.code = cast.string(user?.code);
            dbUser.date_created = cast.date(user?.dateCreated);
            dbUser.date_last = cast.date(user?.dateLast);
            dbUser.user_ref = cast.int(user?.userRef);
            return {dbUser};
        };
    }
}
