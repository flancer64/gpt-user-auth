/**
 * Converts Domain DTO to/from related DTOs (Persistent, etc.) for OpenAI Token.
 * @implements TeqFw_Core_Back_Api_Convert
 */
export default class Fl64_Gpt_User_Back_Convert_Token {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     * @param {Fl64_Gpt_User_Shared_Dto_Token} domDto
     * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_Token} rdbToken
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
            Fl64_Gpt_User_Shared_Dto_Token$: domDto,
            Fl64_Gpt_User_Back_Store_RDb_Schema_Token$: rdbToken
        }
    ) {
        // INSTANCE METHODS

        /**
         * Converts the persistent DTO (RDB) to the domain DTO.
         * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_Token.Dto} dbToken
         * @returns {Fl64_Gpt_User_Shared_Dto_Token.Dto}
         */
        this.db2dom = function ({dbToken}) {
            const res = domDto.createDto();
            res.code = cast.string(dbToken?.code);
            res.dateCreated = cast.date(dbToken?.date_created);
            res.type = cast.string(dbToken?.type);
            res.userRef = cast.int(dbToken?.user_ref);
            return res;
        };

        /**
         * The structure of the returned value.
         * @typedef {Object} Dom2RdbResult
         * @property {Fl64_Gpt_User_Back_Store_RDb_Schema_Token.Dto} dbToken
         * @memberof Fl64_Gpt_User_Back_Convert_Token
         */

        /**
         * Converts the domain DTO to the persistent DTO (RDB).
         * @param {Fl64_Gpt_User_Shared_Dto_Token.Dto} token
         * @returns {Dom2RdbResult}
         */
        this.dom2db = function ({token}) {
            const dbToken = rdbToken.createDto();
            dbToken.code = cast.string(token?.code);
            dbToken.date_created = cast.date(token?.dateCreated);
            dbToken.type = cast.string(token?.type);
            dbToken.user_ref = cast.int(token?.userRef);
            return {dbToken};
        };
    }
}
