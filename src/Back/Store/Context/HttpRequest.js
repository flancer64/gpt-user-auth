/**
 * This class manages the storage of OAuth2 context data in the HTTP request execution context.
 *
 * @implements TeqFw_Core_Shared_Api_Repo_Context
 */
export default class Fl64_Gpt_User_Back_Store_Context_HttpRequest {
    /**
     * @param {Fl64_Gpt_User_Back_Defaults} DEF
     * @param {Fl64_Gpt_User_Back_Dto_OAuth2_Context} dtoFactory - Factory for creating DTO instances.
     */
    constructor(
        {
            Fl64_Gpt_User_Back_Defaults$: DEF,
            Fl64_Gpt_User_Back_Dto_OAuth2_Context$: dtoFactory
        }
    ) {
        const SPACE = DEF.NAME + '/oauth2Context';

        /**
         * @type {function(Fl64_Gpt_User_Back_Dto_OAuth2_Context.Dto=): Fl64_Gpt_User_Back_Dto_OAuth2_Context.Dto}
         */
        this.composeEntity = dtoFactory.createDto;

        /**
         * Creates a new entry in the execution context.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} context - The HTTP request context.
         * @param {Fl64_Gpt_User_Back_Dto_OAuth2_Context.Dto} data - The data to be saved in the context.
         * @returns {void}
         */
        this.create = function (context, data) {
            context[SPACE] = dtoFactory.createDto(data);
        };

        /**
         * Deletes data from the execution context.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} context - The HTTP request context.
         * @returns {void}
         */
        this.delete = function (context) {
            delete context[SPACE];
        };

        /**
         * Reads data from the execution context.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} context - The HTTP request context.
         * @returns {Fl64_Gpt_User_Back_Dto_OAuth2_Context.Dto|null} - The retrieved data or null if not found.
         */
        this.read = function (context) {
            return context[SPACE] || null;
        };

        /**
         * Updates data in the execution context.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} context - The HTTP request context.
         * @param {Fl64_Gpt_User_Back_Dto_OAuth2_Context.Dto} data - The new data to update in the context.
         * @returns {void}
         */
        this.update = function (context, data) {
            if (context[SPACE]) {
                Object.assign(context[SPACE], data);
            } else {
                this.create(context, data);
            }
        };
    }
}
