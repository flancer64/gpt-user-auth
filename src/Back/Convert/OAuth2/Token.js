/**
 * Converts Domain DTO to/from related DTOs (Persistent, etc.) for OAuth2 Token.
 * @implements TeqFw_Core_Back_Api_Convert
 */
export default class Fl64_Gpt_User_Back_Convert_OAuth2_Token {
    /**
     * Constructor for the OAuth2 Token converter.
     *
     * @param {TeqFw_Core_Shared_Util_Cast} cast - Utility for type casting.
     * @param {Fl64_Gpt_User_Shared_Dto_OAuth2_Token} domDto - Domain DTO factory.
     * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Token} rdbDto - Persistent DTO factory.
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
            Fl64_Gpt_User_Shared_Dto_OAuth2_Token$: domDto,
            Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Token$: rdbDto
        }
    ) {
        // INSTANCE METHODS

        /**
         * Converts the persistent DTO (RDB) to the domain DTO.
         * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Token.Dto} dbToken
         * @returns {Fl64_Gpt_User_Shared_Dto_OAuth2_Token.Dto}
         */
        this.db2dom = function ({dbToken}) {
            const res = domDto.createDto();
            res.accessToken = cast.string(dbToken?.access_token);
            res.clientRef = cast.int(dbToken?.client_ref);
            res.dateExpire = cast.date(dbToken?.date_expire);
            res.id = cast.int(dbToken?.id);
            res.refreshToken = cast.string(dbToken?.refresh_token);
            res.scope = cast.string(dbToken?.scope);
            res.userRef = cast.int(dbToken?.user_ref);
            return res;
        };

        /**
         * Converts the domain DTO to the persistent DTO (RDB).
         * @param {Fl64_Gpt_User_Shared_Dto_OAuth2_Token.Dto} token
         * @returns {Object} Contains the persistent DTO.
         */
        this.dom2db = function ({token}) {
            const dbToken = rdbDto.createDto();
            dbToken.access_token = cast.string(token?.accessToken);
            dbToken.client_ref = cast.int(token?.clientRef);
            dbToken.date_expire = cast.date(token?.dateExpire);
            dbToken.id = cast.int(token?.id);
            dbToken.refresh_token = cast.string(token?.refreshToken);
            dbToken.scope = cast.string(token?.scope);
            dbToken.user_ref = cast.int(token?.userRef);
            return {dbToken};
        };
    }
}
