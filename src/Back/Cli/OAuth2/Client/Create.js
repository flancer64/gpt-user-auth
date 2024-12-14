/**
 * @namespace Fl64_Gpt_User_Back_Cli_OAuth2_Client_Create
 */
// MODULE'S IMPORT
import {randomUUID} from 'crypto';

// MODULE'S VARS
const NS = 'Fl64_Gpt_User_Back_Cli_OAuth2_Client_Create';
const OPT_NAME = 'name';
const OPT_REDIRECT_URI = 'redirectUri';

// MODULE'S FUNCTIONS
/**
 * Factory for a CLI command to register a new OAuth2 client.
 *
 * @param {Fl64_Gpt_User_Back_Defaults} DEF - Contains global CLI prefix configuration
 * @param {TeqFw_Core_Shared_Api_Logger} logger
 * @param {TeqFw_Core_Back_Api_Dto_Command.Factory} fCommand
 * @param {TeqFw_Core_Back_Api_Dto_Command_Option.Factory} fOpt
 * @param {TeqFw_Core_Back_App} app - Provides lifecycle management for the application
 * @param {TeqFw_Db_Back_RDb_IConnect} conn - Interface for managing database transactions
 * @param {Fl64_Gpt_User_Back_Mod_OAuth2_Client} modClient - Handles OAuth2 client-related operations
 * @param {typeof Fl64_Gpt_User_Shared_Enum_OAuth2_Client_Status} STATUS - Enum defining possible client statuses
 *
 * @returns {TeqFw_Core_Back_Api_Dto_Command}
 */
export default function Factory(
    {
        Fl64_Gpt_User_Back_Defaults$: DEF,
        TeqFw_Core_Shared_Api_Logger$$: logger,
        'TeqFw_Core_Back_Api_Dto_Command.Factory$': fCommand,
        'TeqFw_Core_Back_Api_Dto_Command_Option.Factory$': fOpt,
        TeqFw_Core_Back_App$: app,
        TeqFw_Db_Back_RDb_IConnect$: conn,
        Fl64_Gpt_User_Back_Mod_OAuth2_Client$: modClient,
        'Fl64_Gpt_User_Shared_Enum_OAuth2_Client_Status.default': STATUS,
    }
) {
    /**
     * Handles the creation of a new OAuth2 client.
     *
     * @param {Object} [opts] - Command-line options provided by the user
     * @returns {Promise<void>}
     */
    async function action(opts) {
        const name = opts[OPT_NAME];
        const uriRedirect = opts[OPT_REDIRECT_URI];
        if (name && uriRedirect) {
            logger.info(`Creating new OAuth2 client named '${name}' with redirect URI '${uriRedirect}'...`);

            const dto = modClient.composeEntity();
            dto.clientId = randomUUID();
            dto.clientSecret = randomUUID();
            dto.name = name;
            dto.redirectUri = uriRedirect;
            dto.status = STATUS.ACTIVE;

            const trx = await conn.startTransaction();
            try {
                const created = await modClient.create({trx, dto});
                await trx.commit();
                console.log(`\n\nClient created successfully: ID=${created.id}, CLIENT_ID=${created.clientId}, SECRET=${created.clientSecret}\n\n`);
            } catch (error) {
                await trx.rollback();
                logger.error(`Error creating client: ${error.message}`);
            }
        } else {
            logger.error('Name and redirect URI must be provided.');
        }
        await app.stop();
    }

    Object.defineProperty(action, 'namespace', {value: NS});

    const res = fCommand.create();
    res.realm = DEF.CLI_PREFIX;
    res.name = 'client-create';
    res.desc = 'Create a new client with a generated ID and secret.';
    res.action = action;

    // Define the --name option
    const optName = fOpt.create();
    optName.flags = `-n, --${OPT_NAME} <name>`;
    optName.description = 'Client name';
    res.opts.push(optName);

    // Define the --redirect-uri option
    const optRedirect = fOpt.create();
    optRedirect.flags = `-r, --${OPT_REDIRECT_URI} <uri>`;
    optRedirect.description = 'Redirect URI for the client';
    res.opts.push(optRedirect);

    return res;
}

