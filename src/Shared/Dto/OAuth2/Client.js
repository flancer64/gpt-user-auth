/**
 * The OAuth2 Client data structure for Business Logic (Domain DTO).
 */

// MODULE'S CLASSES
/**
 * @memberOf Fl64_Gpt_User_Shared_Dto_OAuth2_Client
 */
class Dto {
    /**
     * Unique identifier for the client, used during authorization.
     * @type {string}
     */
    clientId;
    /**
     * Secret key assigned to the client for secure communication.
     * @type {string}
     */
    clientSecret;
    /**
     * Date and time when the client was registered.
     * @type {Date}
     */
    dateCreated;
    /**
     * Unique identifier for the client.
     * @type {number}
     */
    id;
    /**
     * Human-readable name of the client.
     * @type {string}
     */
    name;
    /**
     * Authorized redirect URI for the client.
     * @type {string}
     */
    redirectUri;
    /**
     * Status of the client registration (e.g., ACTIVE, INACTIVE).
     * @type {string}
     * @see Fl64_Gpt_User_Shared_Enum_OAuth2_Client_Status
     */
    status;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Fl64_Gpt_User_Shared_Dto_OAuth2_Client {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     * @param {typeof Fl64_Gpt_User_Shared_Enum_OAuth2_Client_Status} STATUS
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
            'Fl64_Gpt_User_Shared_Enum_OAuth2_Client_Status.default': STATUS,
        }
    ) {
        // INSTANCE METHODS
        /**
         * Create a new DTO and populate it with initialization data.
         * @param {Fl64_Gpt_User_Shared_Dto_OAuth2_Client.Dto} [data]
         * @returns {Fl64_Gpt_User_Shared_Dto_OAuth2_Client.Dto}
         */
        this.createDto = function (data) {
            // Create new DTO and populate with initial data
            const res = Object.assign(new Dto(), data);

            // Cast known attributes
            res.clientId = cast.string(data?.clientId);
            res.clientSecret = cast.string(data?.clientSecret);
            res.dateCreated = cast.date(data?.dateCreated);
            res.id = cast.int(data?.id);
            res.name = cast.string(data?.name);
            res.redirectUri = cast.string(data?.redirectUri);
            res.status = cast.enum(data?.status, STATUS);

            return res;
        };
    }
}
