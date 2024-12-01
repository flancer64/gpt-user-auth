# User Profile Editing Scenario for a Web Application via ChatGPT

## General Description of the Scenario

### 1. Request to Edit Profile

- The user expresses their intent to edit their profile through the chat.
- ChatGPT collects **identification parameters**:
    - **User's email address**: the primary identifier.
    - **User's public PIN code**: can be used as an alternative to the email.
- If the user provides both identifiers, the email takes precedence.

### 2. Generating a Profile Editing Link

- ChatGPT sends the collected data (email and/or PIN) to the service that initiates the profile editing process (
  `Fl64_Gpt_User_Back_Web_Api_Update_Init`).
- The service performs the following steps:
    1. Checks for the user's existence in the database using the provided identifier (email or PIN).
    2. If the user is found:
        - Generates a unique, single-use token.
        - Creates a link containing the token for accessing profile editing.
        - Sends an email to the user with the generated link.
    3. If the user is not found, the process is rejected, and ChatGPT notifies the user of the error.

### 3. Accessing the Link and Editing the Profile

- The user opens the email and clicks on the profile editing link.
- On the web page:
    1. The token from the link is sent to the server for validation via `Fl64_Gpt_User_Back_Web_Api_Update_Load`.
    2. If the token is valid, the user's profile data is loaded.
    3. The user can edit the following parameters:
        - Application locale.
        - Passphrase.
    4. After making changes, the user confirms the updates.

### 4. Saving Changes and Completing the Process

- The web application performs the following:
    1. Receives the profile changes along with the token.
    2. Validates the token:
        - If the token is valid, the changes are saved in the database.
        - If the token is invalid or expired, the process is rejected.
    3. Deletes the token from the system after successful updates.

### 5. User Notification

- The user is notified on the web page about the successful profile update.
- If an error occurs, the user is prompted to repeat the profile editing process.

---

## Endpoints

### `Fl64_Gpt_User_Back_Web_Api_Update_Init`

- **Description:**
  An endpoint for ChatGPT to generate a profile editing link. The service generates a token, creates the editing link,
  and sends it to the user's email.

- **Request Parameters:**
    - `email` (string, optional): The user's email address.
    - `pin` (integer, optional): The user's PIN code.

- **Result:**
    - If the user is found, a link for profile editing is sent to their email.
    - If the user is not found, an error is returned.

---

### `Fl64_Gpt_User_Back_Web_Api_Update_Load`

- **Description:**
  An endpoint for loading the user's profile data before editing. The token is used to verify access rights.

- **Request Parameters:**
    - `token` (string, required): A unique token for accessing profile data.

- **Result:**
    - If the token is valid, the user's profile data (e.g., locale, settings) is returned.
    - If the token is invalid or expired, an error is returned.

---

### `Fl64_Gpt_User_Back_Web_Api_Update_Save`

- **Description:**
  An endpoint for saving changes to the user's profile. The token is used to confirm editing rights.

- **Request Parameters:**
    - `token` (string, required): A unique token for profile editing.
    - `locale` (string, optional): The user's new locale.
    - `passphrase` (string, optional): The user's new passphrase.

- **Result:**
    - If the token is valid, the changes are saved, and the token is deleted.
    - If the token is invalid or expired, an error is returned.

---

## Main Scenario Flow

1. The user requests profile editing through the chat.
2. ChatGPT sends the identifier (PIN or email) to `Fl64_Gpt_User_Back_Web_Api_Update_Init`.
3. The service sends a profile editing link to the user's email.
4. The user clicks on the link, and the profile data is loaded via `Fl64_Gpt_User_Back_Web_Api_Update_Load`.
5. The user edits their profile on the web page.
6. The web application saves the changes via `Fl64_Gpt_User_Back_Web_Api_Update_Save`.

---

## Exceptional Scenarios

1. **User Not Found**:
    - If the user with the specified PIN or email does not exist, ChatGPT informs the user and suggests verifying the
      input data.

2. **Invalid Token**:
    - If the user attempts to use an invalid token, the web application displays an error and suggests requesting a new
      link.

3. **Error Saving Changes**:
    - If an error occurs while saving changes (e.g., database issues), the web application notifies the user and
      suggests retrying later.

---
