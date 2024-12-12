/**
 * The User Session data structure for Business Logic (Domain DTO).
 */

// MODULE'S CLASSES
/**
 * @memberOf Fl64_Gpt_User_Shared_Dto_User_Session
 */
class Dto {
    /**
     * Date and time when the session was created.
     * @type {Date}
     */
    dateCreated;

    /**
     * IP address from which the session was opened.
     * @type {string}
     */
    ipAddress;

    /**
     * The unique session identifier (UUID).
     * @type {string}
     */
    sessionId;

    /**
     * Information about the client (browser, device).
     * @type {string}
     */
    userAgent;

    /**
     * Reference to the user who owns the session.
     * @type {number}
     */
    userRef;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Fl64_Gpt_User_Shared_Dto_User_Session {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
        }
    ) {
        // INSTANCE METHODS
        /**
         * Create a new DTO and populate it with initialization data.
         * @param {Fl64_Gpt_User_Shared_Dto_User_Session.Dto} [data]
         * @returns {Fl64_Gpt_User_Shared_Dto_User_Session.Dto}
         */
        this.createDto = function (data) {
            // Create new DTO and populate with initial data
            const res = Object.assign(new Dto(), data);

            // Cast known attributes
            res.dateCreated = cast.date(data?.dateCreated);
            res.ipAddress = cast.string(data?.ipAddress);
            res.sessionId = cast.string(data?.sessionId);
            res.userAgent = cast.string(data?.userAgent);
            res.userRef = cast.int(data?.userRef);

            return res;
        };
    }
}
