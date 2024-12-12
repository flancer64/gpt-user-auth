/**
 * Converts Domain DTO to/from related DTOs (Persistent, etc.) for User Session.
 * @implements TeqFw_Core_Back_Api_Convert
 */
export default class Fl64_Gpt_User_Back_Convert_User_Session {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     * @param {Fl64_Gpt_User_Shared_Dto_User_Session} domDto
     * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_User_Session} rdbDto
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
            Fl64_Gpt_User_Shared_Dto_User_Session$: domDto,
            Fl64_Gpt_User_Back_Store_RDb_Schema_User_Session$: rdbDto,
        }
    ) {
        // INSTANCE METHODS

        /**
         * Converts the persistent DTO (RDB) to the domain DTO.
         * @param {Fl64_Gpt_User_Back_Store_RDb_Schema_User_Session.Dto} dbSession
         * @returns {Fl64_Gpt_User_Shared_Dto_User_Session.Dto}
         */
        this.db2dom = function ({dbSession}) {
            const res = domDto.createDto();
            res.dateCreated = cast.date(dbSession?.date_created);
            res.sessionId = cast.string(dbSession?.session_id);
            res.userRef = cast.int(dbSession?.user_ref);
            res.ipAddress = cast.string(dbSession?.ip_address);
            res.userAgent = cast.string(dbSession?.user_agent);
            return res;
        };

        /**
         * The structure of the returned value.
         * @typedef {Object} Dom2RdbResult
         * @property {Fl64_Gpt_User_Back_Store_RDb_Schema_User_Session.Dto} dbSession
         * @memberof Fl64_Gpt_User_Back_Convert_User_Session
         */

        /**
         * Converts the domain DTO to the persistent DTO (RDB).
         * @param {Fl64_Gpt_User_Shared_Dto_User_Session.Dto} session
         * @returns {Dom2RdbResult}
         */
        this.dom2db = function ({session}) {
            const dbSession = rdbDto.createDto();
            dbSession.date_created = cast.date(session?.dateCreated);
            dbSession.session_id = cast.string(session?.sessionId);
            dbSession.user_ref = cast.int(session?.userRef);
            dbSession.ip_address = cast.string(session?.ipAddress);
            dbSession.user_agent = cast.string(session?.userAgent);
            return {dbSession};
        };
    }
}
