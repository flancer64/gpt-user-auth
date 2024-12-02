/**
 * Utility class for logging OpenAI-related HTTP request headers.
 *
 * This class provides methods to extract and log headers from incoming HTTP requests
 * that start with the prefix `openai-`. It relies on a logger instance for output.
 */
export default class Fl64_Gpt_User_Back_Util_Log {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger - instance
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$: logger,
        }
    ) {
        // INSTANCE METHODS
        /**
         * Logs all headers starting with "openai-" from the HTTP request.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} httpRequest
         */
        this.traceOpenAi = function (httpRequest) {
            const headers = httpRequest?.headers;
            const openAiHeaders = Object.entries(headers || {})
                .filter(([key]) => key.toLowerCase().startsWith('openai-'));

            if (openAiHeaders.length > 0) {
                logger.info(`OpenAI-related headers: ${JSON.stringify(openAiHeaders)}`);
            }
        };
    }
}
