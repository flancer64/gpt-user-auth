# User Registration Scenario for a Web Application via ChatGPT

## General Description of the Scenario

### 1. Registration Initiation

- The user expresses their intent to register in the web application. ChatGPT collects the following data through a
  conversational interface:
    - **User's email address**.
    - **Consent to process personal data**.
    - **Preferred locale** for interacting with the application.
    - **Passphrase**, which will be used as a PIN confirmation in the future.

### 2. Data Transmission

- The chat sends the collected data to the web application's registration initiation endpoint (
  `Fl64_Gpt_User_Back_Web_Api_SignUp_Init`):
    - Email.
    - User consent.
    - Passphrase.
    - User locale.

### 3. User Registration in the Web Application

- The web application validates the email address:
    - If the email is already registered, the process is rejected, and the chat notifies the user, offering a password
      recovery page.
    - If the email is new, a user record is created with the status **"pending verification"**.
- At this stage:
    - A **public PIN** is generated as the user's identifier.
    - The PIN is stored in the database, but the user status remains **inactive**.
- An email containing a verification token is sent to the user.
- The PIN and confirmation of successful registration (pending verification) are sent back to the chat.

### 4. Email Verification

- The user receives an email with a token and follows the provided link.
- After successful verification:
    - The user status is updated to **"active"**.

### 5. Data Retained in the Chat

- After the registration process is completed, the following data remains in the chat:
    - **PIN**, serving as the user's public identifier.
    - **Passphrase**, used for confirming ownership of the identifier.
- The user must remember these details for future use. Otherwise, a recovery process will be required.

### 6. Chat Access to the Web Application

- After email verification, the user can fully access the application via chat.
- To interact with the application through the chat, the user must provide:
    - **PIN**.
    - **Passphrase** for identifier confirmation.
- The chat uses this data to interact with the web application on behalf of the user.

---

## Endpoints

### `Fl64_Gpt_User_Back_Web_Api_SignUp_Init`

- **Description:**
  An endpoint accessible to ChatGPT to initiate the registration process. At this stage:
    - A user record is created.
    - A PIN is generated.
    - An email with a verification token is sent.

- **Request Parameters:**
    - `consent` (boolean, required): User's consent for data processing.
    - `email` (string, required): User's email address.
    - `locale` (string, required): User's preferred locale.
    - `passphrase` (string, required): Passphrase for confirming ownership of the PIN.

### `Fl64_Gpt_User_Back_Web_Api_SignUp_Verify`

- **Description:**
  An endpoint inaccessible to ChatGPT, used for email verification. Upon successful verification:
    - The user status is updated to "active".
    - The PIN becomes available for use.

- **Request Parameters:**
    - `token` (string, required): The verification token sent to the user's email.
