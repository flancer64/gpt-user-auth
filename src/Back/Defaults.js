/**
 * Plugin constants (hardcoded configuration) for frontend code.
 */
export default class Fl64_Gpt_User_Back_Defaults {
    EMAIL_SIGN_UP = 'SignUp';
    EMAIL_UPDATE = 'Update';

    HTTP_HEAD_OPENAI_CONVERSATION_ID = 'openai-conversation-id';
    HTTP_HEAD_OPENAI_EPHEMERAL_USER_ID = 'openai-ephemeral-user-id';
    HTTP_HEAD_OPENAI_GPT_ID = 'openai-gpt-id';

    /**
     * Default locale for emails in this plugin.
     * @type {string}
     */
    LOCALE = 'en';

    /** @type {TeqFw_Web_Back_Defaults} */
    MOD_WEB;

    NAME;

    /** @type {Fl64_Gpt_User_Shared_Defaults} */
    SHARED;
    /**
     * @param {TeqFw_Web_Back_Defaults} MOD_WEB
     * @param {Fl64_Gpt_User_Shared_Defaults} SHARED
     */
    constructor(
        {
            TeqFw_Web_Back_Defaults$: MOD_WEB,
            Fl64_Gpt_User_Shared_Defaults$: SHARED,
        }
    ) {

        this.MOD_WEB = MOD_WEB;
        this.SHARED = SHARED;

        this.NAME = SHARED.NAME;

        Object.freeze(this);
    }
}
