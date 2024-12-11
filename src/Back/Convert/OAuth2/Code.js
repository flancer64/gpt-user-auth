/**
 * Converts Domain DTO to/from related DTOs (Persistent, etc.) for OAuth2 Authorization Code.
 * @implements TeqFw_Core_Back_Api_Convert
 */
export default class Fl64_Gpt_User_Back_Convert_OAuth2_Code {
    /**
     * Constructor for the converter.
     *
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     * @param {Fl64_Gpt_User_Shared_Dto_OAuth2_Code} domDto
     * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Code} rdbDto
     */
    constructor({
                    TeqFw_Core_Shared_Util_Cast$: cast,
                    Fl64_Gpt_User_Shared_Dto_OAuth2_Code$: domDto,
                    Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Code$: rdbDto
                }) {
        // INSTANCE METHODS

        /**
         * Converts the persistent DTO (RDB) to the domain DTO.
         * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Code.Dto} dbCode
         * @returns {Fl64_Gpt_User_Shared_Dto_OAuth2_Code.Dto}
         */
        this.db2dom = function ({dbCode}) {
            const res = domDto.createDto();
            res.id = cast.int(dbCode?.id);
            res.code = cast.string(dbCode?.code);
            res.clientId = cast.int(dbCode?.client_id);
            res.userId = cast.int(dbCode?.user_id);
            res.expiresAt = cast.date(dbCode?.expires_at);
            res.redirectUri = cast.string(dbCode?.redirect_uri);
            res.scope = cast.string(dbCode?.scope);
            return res;
        };

        /**
         * Converts the domain DTO to the persistent DTO (RDB).
         * @param {Fl64_Gpt_User_Shared_Dto_OAuth2_Code.Dto} code
         * @returns {Object} Persistent DTO
         * @property {Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Code.Dto} dbCode
         */
        this.dom2db = function ({code}) {
            const dbCode = rdbDto.createDto();
            dbCode.id = cast.int(code?.id);
            dbCode.code = cast.string(code?.code);
            dbCode.client_id = cast.int(code?.clientId);
            dbCode.user_id = cast.int(code?.userId);
            dbCode.expires_at = cast.date(code?.expiresAt);
            dbCode.redirect_uri = cast.string(code?.redirectUri);
            dbCode.scope = cast.string(code?.scope);
            return {dbCode};
        };
    }
}
