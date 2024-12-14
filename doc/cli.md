### `client-create` Command

This command allows you to register a new OAuth2 client with a unique ID, secret, and redirect URI.

#### Usage

```bash
./bin/tequila.mjs client-create -n <name> -r <redirectUri>
```

#### Options

- `-n, --name <name>`  
  The name of the client to be registered. (Required)

- `-r, --redirectUri <uri>`  
  The redirect URI to be used for the client. (Required)

#### Example

```bash
./bin/tequila.mjs client-create -n "My Test Client" -r "https://example.com/callback"
```

#### Output

Upon successful execution, the command outputs:

```text
Client created successfully:
ID=1
CLIENT_ID=<generated-client-id>
SECRET=<generated-client-secret>
```

#### Errors

If required parameters are missing, the command will log:

```text
Name and redirect URI must be provided.
```
