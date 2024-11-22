/**
 * Local configuration DTO for the plugin (the `@flancer64/gpt-user-auth` node in the `./etc/local.json` file).
 * @see TeqFw_Core_Back_Config
 *
 * @memberOf Fl64_Gpt_User_Back_Plugin_Dto_Config_Local
 */
class Dto {
    /**
     * @type {string[]}
     */
    authBearerTokens;
}

/**
 * Factory class to create instances of the local plugin configuration DTO.
 *
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Fl64_Gpt_User_Back_Plugin_Dto_Config_Local {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
        }
    ) {
        /**
         * Creates and initializes a DTO with the provided data.
         * @param {Fl64_Gpt_User_Back_Plugin_Dto_Config_Local.Dto} data
         * @returns {Fl64_Gpt_User_Back_Plugin_Dto_Config_Local.Dto}
         */
        this.createDto = function (data) {
            // Create new DTO and populate it with initialization data
            const res = Object.assign(new Dto(), data);
            // Cast known attributes to ensure proper types
            res.authBearerTokens = cast.arrayOfStr(data?.authBearerTokens);
            return res;
        };
    }
}