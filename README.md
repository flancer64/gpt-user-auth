# gpt-user-auth

`@flancer64/gpt-user-auth` is a Tequila Framework plugin designed to enable user authentication workflows through
conversational interfaces powered by ChatGPT. It simplifies user registration, email verification, and profile
management directly within a chat environment, providing a seamless and user-friendly experience.

## Overview

This plugin is ideal for applications that want to grow their user base with minimal technical overhead. Unlike
OAuth-based authentication, which requires users to have existing accounts in third-party systems, this plugin allows
users to register and manage their accounts directly through the chat interface.

While the plugin is well-suited for small to medium-sized projects prioritizing ease of use and rapid onboarding,
developers should evaluate its security features against their specific application needs, especially in cases involving
highly sensitive data.

### Key Features

1. **User Registration**  
   Collect user data interactively via ChatGPT and initiate the account creation process with email verification.

2. **Email Verification**  
   Validate user-provided email addresses and activate accounts upon successful verification.

3. **Profile Management**  
   Allow users to request profile edits or reset their credentials through a secure link sent to their email.

4. **Test Email Sending**  
   Enable registered users to send test emails, demonstrating integration between the chatbot and the application.

---

## Functionality Groups

### 1. Registration

Users can register for your application directly through a conversational interface. The plugin collects essential data,
including an email address, consent for data processing, a preferred locale, and a passphrase. Once submitted, the
system:

- Creates a new user record with a "pending verification" status.
- Sends an email verification token to the provided address.
- Returns a PIN code and passphrase to the user for future interactions.

This approach is designed for straightforward user onboarding without requiring external accounts.

---

### 2. Email Verification

The plugin ensures that only verified users can access the application's features. Upon receiving the email verification
token:

- The user’s account status is updated to "active."
- The PIN code and passphrase become functional credentials for authentication.

This step is essential for confirming ownership of the provided email.

---

### 3. Profile Management

Users can request updates to their profile or reset their credentials via ChatGPT. The system generates a secure link
with a one-time token, which is sent to the user's email. Through this link, users can:

- Change their locale or other settings.
- Update their passphrase.

The token ensures secure access, and all changes are confirmed before being applied.

---

### 4. Test Email Sending

Registered users can send test emails to themselves through the chatbot to verify the integration and ensure that their
email address is functioning correctly.

---

## Use Cases

This plugin is best suited for:

- Applications seeking to streamline user onboarding directly from chat interfaces.
- Projects that prioritize ease of setup and conversational interactions over complex authentication mechanisms.
- Small and medium-sized applications where security measures align with the data's sensitivity.

---

## Limitations

- **Security**: While the plugin offers basic protections, sensitive applications may require additional layers of
  security, such as two-factor authentication (2FA).
- **Scalability**: For large-scale systems, developers should consider more robust identity management solutions.
- **OAuth Alternatives**: This plugin does not replace OAuth for systems requiring integration with third-party
  accounts.

For technical details and API documentation, please refer to the [Technical Documentation](doc/overview_dev.md).

---

## License

This plugin is distributed under the Apache License 2.0. See the [LICENSE](./LICENSE) file for more details.

---
