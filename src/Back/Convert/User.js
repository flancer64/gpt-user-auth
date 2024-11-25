/**
 * Converts Domain DTO to/from related DTOs (Persistent, etc.) for OpenAI User.
 * @implements TeqFw_Core_Back_Api_Convert
 */
export default class Fl64_Gpt_User_Back_Convert_User {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     * @param {Fl64_Gpt_User_Shared_Dto_User} domDto
     * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_User} rdbDto
     * @param {typeof Fl64_Gpt_User_Shared_Enum_User_Status} STATUS
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
            Fl64_Gpt_User_Shared_Dto_User$: domDto,
            Fl64_Gpt_User_Back_Store_RDb_Schema_User$: rdbDto,
            'Fl64_Gpt_User_Shared_Enum_User_Status.default': STATUS,
        }
    ) {
        // INSTANCE METHODS

        /**
         * Converts the persistent DTO (RDB) to the domain DTO.
         * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_User.Dto} dbUser
         * @returns {Fl64_Gpt_User_Shared_Dto_User.Dto}
         */
        this.db2dom = function ({dbUser}) {
            const res = domDto.createDto();
            res.dateCreated = cast.date(dbUser?.date_created);
            res.email = cast.string(dbUser?.email);
            res.locale = cast.string(dbUser?.locale);
            res.passHash = cast.string(dbUser?.pass_hash);
            res.passSalt = cast.string(dbUser?.pass_salt);
            res.pin = cast.int(dbUser?.pin);
            res.status = cast.enum(dbUser?.status, STATUS);
            res.userRef = cast.int(dbUser?.user_ref);
            return res;
        };

        /**
         * The structure of the returned value.
         * @typedef {Object} Dom2RdbResult
         * @property {Fl64_Gpt_User_Back_Store_RDb_Schema_User.Dto} dbUser
         * @memberof Fl64_Gpt_User_Back_Convert_User
         */

        /**
         * Converts the domain DTO to the persistent DTO (RDB).
         * @param {Fl64_Gpt_User_Shared_Dto_User.Dto} user
         * @returns {Dom2RdbResult}
         */
        this.dom2db = function ({user}) {
            const dbUser = rdbDto.createDto();
            dbUser.date_created = cast.date(user?.dateCreated);
            dbUser.email = cast.string(user?.email);
            dbUser.locale = cast.string(user?.locale);
            dbUser.pass_hash = cast.string(user?.passHash);
            dbUser.pass_salt = cast.string(user?.passSalt);
            dbUser.pin = cast.int(user?.pin);
            dbUser.status = cast.enum(user?.status, STATUS);
            dbUser.user_ref = cast.int(user?.userRef);
            return {dbUser};
        };
    }
}
