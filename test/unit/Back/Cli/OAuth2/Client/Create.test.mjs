import {strict as assert} from 'assert';
import {container} from '@teqfw/test'; // Dependency Injection container

// Mock dependencies
/** @type {TeqFw_Core_Back_App} */
const app = await container.get('TeqFw_Core_Back_App$');
/** @type {TeqFw_Db_Back_RDb_IConnect} */
const conn = await container.get('TeqFw_Db_Back_RDb_IConnect$');
/** @type {TeqFw_Core_Shared_Api_Logger} */
const logger = await container.get('TeqFw_Core_Shared_Api_Logger$$');
/** @type {Fl64_Gpt_User_Back_Mod_OAuth2_Client} */
const modClient = await container.get('Fl64_Gpt_User_Back_Mod_OAuth2_Client$');

// Get the command factory
/** @type {Function} */
const CommandFactory = await container.get('Fl64_Gpt_User_Back_Cli_OAuth2_Client_Create.default');

// Set up mocks
const mockTransaction = {
    commit: async () => {},
    rollback: async () => {},
};

conn.startTransaction = async () => mockTransaction;

modClient.create = async ({dto}) => ({
    id: 1,
    clientId: dto.clientId,
    clientSecret: dto.clientSecret,
});

logger.info = () => {};
logger.error = () => {};

const command = CommandFactory({
    Fl64_Gpt_User_Back_Defaults$: {CLI_PREFIX: 'test-prefix'},
    TeqFw_Core_Shared_Api_Logger$$: logger,
    'TeqFw_Core_Back_Api_Dto_Command.Factory$': {create: () => ({opts: []})},
    'TeqFw_Core_Back_Api_Dto_Command_Option.Factory$': {
        create: () => ({}),
    },
    TeqFw_Core_Back_App$: app,
    TeqFw_Db_Back_RDb_IConnect$: conn,
    Fl64_Gpt_User_Back_Mod_OAuth2_Client$: modClient,
    'Fl64_Gpt_User_Shared_Enum_OAuth2_Client_Status.default': {ACTIVE: 'ACTIVE'},
});

describe('Fl64_Gpt_User_Back_Cli_OAuth2_Client_Create', () => {
    it('should create a new client successfully', async () => {
        const mockOpts = {
            name: 'Test Client',
            redirectUri: 'https://example.com/callback',
        };

        let output = '';
        const originalLog = console.log;
        console.log = (msg) => {
            output += msg + '\n';
        };

        await command.action(mockOpts);

        console.log = originalLog; // Restore original console.log

        assert.match(output, /Client created successfully/);
        assert.match(output, /CLIENT_ID/);
        assert.match(output, /SECRET/);
    });

    it('should fail if required options are missing', async () => {
        const mockOpts = {};

        let errorOutput = '';
        const originalError = logger.error;
        logger.error = (msg) => {
            errorOutput += msg + '\n';
        };

        await command.action(mockOpts);

        logger.error = originalError; // Restore original logger.error

        assert.match(errorOutput, /Name and redirect URI must be provided/);
    });
});
