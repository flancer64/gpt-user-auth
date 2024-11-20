/**
 * Plugin constants (hardcoded configuration) for shared code.
 */
export default class Fl64_Gpt_User_Shared_Defaults {

    NAME = '@flancer64/gpt-user-auth';

    /** @type {TeqFw_Web_Shared_Defaults} */
    MOD_WEB;

    ROUTE_VERIFY = '/openai/verify.html?token=:code';

    constructor(
        {
            TeqFw_Web_Shared_Defaults$: MOD_WEB
        }
    ) {
        this.MOD_WEB = MOD_WEB;
        Object.freeze(this);
    }
}
