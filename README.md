# gpt-user-auth

TeqFW plugin for seamless user authentication via ChatGPT. This plugin enables user registration, login, and profile
management with the power of AI, ensuring a user-friendly and secure authentication experience.

## User Registration

* `/web/@flancer64/gpt-user-auth/signup/verify.html?token=:code`: веб-страница для верификации email-адреса
  свежезарегистрированного пользователя.
* `Fl64_Gpt_User_Back_Web_Api_SignUp_Init`: веб-сервис для регистрации email-адреса пользователя и отправки
  верифицирующего email'а.
* `Fl64_Gpt_User_Back_Web_Api_SignUp_Verify`: веб-сервис для верификации email-адреса пользователя.
* `Fl64_Gpt_User_Back_Email_SignUp_Init`: сервис, выполняющий непосредственную отправку верифицирующего email'а.

## Authentication

* `Fl64_Gpt_User_Back_Mod_Auth`: модель для проверки токена авторизации сервиса в http-запросах и для загрузки профиля
  пользователя по его PIN'у и кодовой фразе.

## Test Email

* `Fl64_Gpt_User_Back_Web_Api_Test_Email`: веб-сервис по отправке зарегистрированным пользователем тестового email'а
  самому себе.

## Profile Management

* `view`:
* `update`:
* `restore`