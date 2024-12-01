# Technical Overview of @flancer64/gpt-user-auth Plugin

This document provides a concise overview of the plugin's main components, highlighting key code elements and their
purposes.

---

## Services

- **Fl64_Gpt_User_Back_Web_Api_SignUp_Init**: Initiates user registration by collecting data and sending a verification
  email.
- **Fl64_Gpt_User_Back_Web_Api_SignUp_Verify**: Verifies the user's email and activates the account.
- **Fl64_Gpt_User_Back_Web_Api_Test_Email**: Allows registered users to send test emails to their own address.
- **Fl64_Gpt_User_Back_Web_Api_Update_Init**: Generates a secure link for profile updates.
- **Fl64_Gpt_User_Back_Web_Api_Update_Load**: Loads user profile data for editing based on a token.
- **Fl64_Gpt_User_Back_Web_Api_Update_Save**: Saves updated user profile data after validation.

## Models

- **Fl64_Gpt_User_Back_Mod_Auth**: Validates Bearer tokens in HTTP requests and provides methods for loading user data
  by PIN and passphrase, ensuring proper authentication and user status verification.
- **Fl64_Gpt_User_Back_Mod_Token**: Manages secure tokens for email verification and profile updates.
- **Fl64_Gpt_User_Back_Mod_User**: Represents user data.

## Emails

- **Fl64_Gpt_User_Back_Email_SignUp_Init**: Responsible for sending verification emails to newly registered users.
- **Fl64_Gpt_User_Back_Email_Update_Init**: Sends secure links to users for updating their profiles.

### Email Templates

- `etc/email/en/SignUp`: Verification Email Template
- `etc/email/en/Update`: Profile Update Email Template

## Data Storage (RDB Tables)

- **Fl64_Gpt_User_Back_Store_RDb_Schema_Token**: Stores tokens for email verification and profile updates.
- **Fl64_Gpt_User_Back_Store_RDb_Schema_User**: Stores user-related data such as email, PIN, and status.

## Plugin Configuration

- **Fl64_Gpt_User_Back_Plugin_Dto_Config_Local**: Factory for creating local configuration DTOs for the plugin,
  including settings such as allowed Bearer tokens for authentication.

---

This document serves as a quick reference for developers. For more details, consult the codebase and additional
documentation.
