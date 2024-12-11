/**
 * Converts Domain DTO to/from related DTOs (Persistent, etc.) for OAuth2 Client.
 * @implements TeqFw_Core_Back_Api_Convert
 */
export default class Fl64_Gpt_User_Back_Convert_OAuth2_Client {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     * @param {Fl64_Gpt_User_Shared_Dto_OAuth2_Client} domDto
     * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Client} rdbDto
     * @param {typeof Fl64_Gpt_User_Shared_Enum_OAuth2_Client_Status} STATUS
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
            Fl64_Gpt_User_Shared_Dto_OAuth2_Client$: domDto,
            Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Client$: rdbDto,
            'Fl64_Gpt_User_Shared_Enum_OAuth2_Client_Status.default': STATUS,
        }
    ) {
        // INSTANCE METHODS

        /**
         * Converts the persistent DTO (RDB) to the domain DTO.
         * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Client.Dto} dbClient
         * @returns {Fl64_Gpt_User_Shared_Dto_OAuth2_Client.Dto}
         */
        this.db2dom = function ({dbClient}) {
            const res = domDto.createDto();
            res.clientId = cast.string(dbClient?.client_id);
            res.clientSecret = cast.string(dbClient?.client_secret);
            res.dateCreated = cast.date(dbClient?.date_created);
            res.id = cast.int(dbClient?.id);
            res.name = cast.string(dbClient?.name);
            res.redirectUri = cast.string(dbClient?.redirect_uri);
            res.status = cast.enum(dbClient?.status, STATUS);
            return res;
        };

        /**
         * The structure of the returned value.
         * @typedef {Object} Dom2RdbResult
         * @property {Fl64_Gpt_User_Back_Store_RDb_Schema_OAuth2_Client.Dto} dbClient
         * @memberof Fl64_Gpt_User_Back_Convert_OAuth2_Client
         */

        /**
         * Converts the domain DTO to the persistent DTO (RDB).
         * @param {Fl64_Gpt_User_Shared_Dto_OAuth2_Client.Dto} client
         * @returns {Dom2RdbResult}
         */
        this.dom2db = function ({client}) {
            const dbClient = rdbDto.createDto();
            dbClient.client_id = cast.string(client?.clientId);
            dbClient.client_secret = cast.string(client?.clientSecret);
            dbClient.date_created = cast.date(client?.dateCreated);
            dbClient.id = cast.int(client?.id);
            dbClient.name = cast.string(client?.name);
            dbClient.redirect_uri = cast.string(client?.redirectUri);
            dbClient.status = cast.enum(client?.status, STATUS);
            return {dbClient};
        };
    }
}
