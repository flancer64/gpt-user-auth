# User Registration Scenario for a Web Application via ChatGPT

## General Scenario Overview

### 1. Registration Initiation

- The user expresses interest in registering for the web application. ChatGPT collects the following data in a
  conversational manner:
    - **User's email address**.
    - **Consent to personal data processing**.
    - **Preferred locale** for interacting with the application.
    - **Passphrase**, which will be used for verifying rights to the identifier (PIN) in the future.

### 2. Data Submission

- The chat sends the collected data to the web application server via the registration initiation entry point (
  `Fl64_Gpt_User_Back_Web_Api_SignUp_Init`):
    - Email.
    - User consent.
    - Passphrase.
    - User locale.

### 3. User Registration in the Web Application

- The web application validates the email address:
    - If the email is already registered, the process is rejected, and the chat notifies the user, suggesting the
      password recovery page.
    - If the email is new, a user record is created with the status **"pending verification"**.
- At this stage:
    - A **public PIN** — the user's identifier — is generated.
    - The PIN is saved in the database, but the user's status remains **inactive**.
- An email with a verification token is sent to the user.
- The PIN and a confirmation of successful registration (pending verification) are sent back to the chat.

### 4. Email Verification

- The user receives an email with the token and clicks the provided link.
- Upon successful verification:
    - The user's status is updated to **"active"**.

### 5. Information Retained in the Chat

- After the registration entry point completes successfully, the following remain in the chat:
    - **PIN**, which is the user's public identifier.
    - **Passphrase**, used for confirming rights to the identifier.
- The user must remember these details for future use; otherwise, they will need to go through the account recovery
  process.

### 6. Chat Access to the Web Application

- After email verification, the user can fully utilize the application via the chat.
- To access functionality through the chat, the user must provide:
    - **PIN**.
    - **Passphrase** to confirm rights to the identifier.
- The chat uses these details to interact with the web application on the user's behalf.

---

## End Points

### `Fl64_Gpt_User_Back_Web_Api_SignUp_Init`

- **Description:**
  Entry point accessible to ChatGPT to initiate the registration process.
  At this stage:
    - A user record is created.
    - A PIN is generated.
    - A verification email is sent.

- **Request Parameters:**
    - `consent` (boolean, required): User consent for data processing.
    - `email` (string, required): User's email address.
    - `locale` (string, required): User's locale.
    - `passphrase` (string, required): Passphrase for confirming rights to the PIN.

### `Fl64_Gpt_User_Back_Web_Api_SignUp_Verify`

- **Description:**
  Entry point unavailable to ChatGPT for confirming the email address.
  After confirmation:
    - The user's status is updated to "active".
    - The PIN becomes available for use.

- **Request Parameters:**
    - `token` (string, required): Verification token sent to the user's email.
