/**
 * OAuth2 Context Data Transfer Object (Domain DTO).
 *
 * Represents the context of an authenticated request, including client and user data,
 * and additional contextual information.
 *
 * @memberOf Fl64_Gpt_User_Back_Dto_OAuth2_Context
 */
class Dto {
    /**
     * Unique integer identifier for the client.
     * @type {number}
     */
    clientId;

    /**
     * Unique integer identifier for the user.
     * @type {number}
     */
    userId;
}

/**
 * Factory for creating OAuth2 Context DTOs.
 *
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Fl64_Gpt_User_Back_Dto_OAuth2_Context {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast - Utility for type casting.
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast
        }
    ) {
        /**
         *
         * @param {Fl64_Gpt_User_Back_Dto_OAuth2_Context.Dto} [data]
         * @return {Fl64_Gpt_User_Back_Dto_OAuth2_Context.Dto}
         */
        this.createDto = function (data) {
            const res = Object.assign(new Dto(), data);

            // Cast attributes
            res.clientId = cast.int(data?.clientId);
            res.userId = cast.int(data?.userId);

            return res;
        };
    }
}
