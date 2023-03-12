Authentication Service

Are you looking for a reliable and secure authentication service for your web application? Look no further! Our authentication service is based on the `Express/Node.js` platform and provides a variety of features to help you protect your endpoints and ensure your users' data is safe.

- Features

This authentication service uses the following technologies:

   - Mongoose wrapper for persisting data
   - Mocha & Chai/Chai-http for testing
   - Docker and Docker Compose for deploying configuration
   - Nginx as a reverse-proxy for signing HTTPS traffic
   - Certbot for getting certificates

In addition, our service provides the following features:

- Domain Whitelisting

To ensure only authorized domains can access your web application, our service provides a domain whitelisting feature. You can add your domain to the `"Allow List"` using the settings page of this service, which can be found on the root path of the service domain. You need to get the `admin` password to permanently add your domain, or the `dev` password `[password: devStrongPassword]` to allow your domain for only one day. After successfully adding your origin, you will get a generated `JWT secret`. You need to use it for validating access token on your application backend to protect your endpoints.

- Registration

Your service can send register credentials in the body of the request to the `/register` endpoint. You need to provide `{email, password}`fields, and if a user with such an email does not exist in the service, they will be successfully added to the service's registered user list. Otherwise, you will get an error response. For the email and password fields, the following restrictions apply:

    Password field must be a string, with a minimum length of 5 symbols and a maximum length of 20.
    Email field should be a valid email string.

- Login

After a successful login, you will get an access token in the request body. It expires after `10 minutes`, and a refresh token in a cookie (configured as `httpOnly`, so you can't modify it on the client side) that expires after 1 month.

- Token Refresh

When your access token expires, you can post a request to the `/refreshToken` endpoint to refresh your `access/refresh` token pair. You don't need to specify any body data; the refresh token will be obtained from the cookie set by the login flow.

- Email Validation

There is also a `/checkEmail` endpoint to check if the specified email already exists in the service's user list. You need to provide the `{email}` field with a valid email string in your request body.

- Password Reset

To reset the password for your user, this service provides the following three endpoints:

   - `/resetPassword` is the first endpoint to start the reset password flow. You need to send an email of the user whose password is to be reset in your POST request body. If there is such a user in the service's registered user list, an email with a generated reset password link will be sent to the specified mailbox. That link will be available for `1 hour`, after which the token expires.
   - `/resetPasswordLink/:token` is a middle chain route that forwards the generated reset password link in the user's email. When the user follows it from the email, and the token has not yet expired, this route redirects the user to your application's `/resetPassword/:token` route. You need to provide this route; otherwise, it fails. Then you can get the token as a param from the URL and use it for the next route to complete the reset password flow.
   - `/setPassword` is the last endpoint in the reset password flow. You need to pass the new password and reset password token in the body of the request to this endpoint to update

Public API endpoints

- Route: /register

    This route handles the user registration process. It expects the email and password of a new user to be sent in the request body and responds with the user ID of the newly created user.

    - Usage

    To use this route, make a POST request to the endpoint `/register` with the following parameters in the request body:

        email: The email address of the new user.
        password: The password of the new user.

    - Responses

    If the user with the provided email is already registered, the route will respond with an HTTP `400` status code and an error message `"User already registered"`. The response will also include a `predicate` key with a value of `'EXIST'`.

    If the request body is not valid, the route will respond with an HTTP `400` status code and an error message. The response will also include a `predicate` key with a value of `'INCORRECT'` and an `errors` key with an array of errors.

    If the registration is successful, the route will respond with an HTTP `200` status code and a JSON object containing the user ID.

    If there is a server error, the route will respond with an HTTP `500` status code and an error message `"Server error {error message}"`.

   - Validation

    This route uses Express-validator to validate the request body. It checks that the password is between 5 and 20 characters in length and is a string.

   - Security

    This route uses `bcrypt` to securely hash the password before storing it in the database.


- Route: /login

    This route handles the user authentication process for logging in. It expects the email and password of a registered user to be sent in the request body and responds with a JSON Web Token (JWT) pair that can be used for further authentication.

    - Usage

    To use this route, make a POST request to the endpoint `/login` with the following parameters in the request body:

        email: The email address of the registered user.
        password: The password of the registered user.

    If the user is registered and the password is correct, the route will respond with an HTTP `200` status code and a JSON object containing the access token for further authentication.

    If the user is not registered, the route will respond with an HTTP `400` status code and an error message `"User not registred"`, and a `predicate` key with `'NOT_EXIST'` value.

    If the password is incorrect, the route will respond with an HTTP `401` status code and an error message `"Password incorrect"`, and a `predicate` key with `'PASS_INCORRECT'` value.

    If the credentials are not correct, the route will respond with an HTTP `400` status code and an error message, a predicate key with `'INCORRECT'` value, and an `errors` key with an array of errors.

    If there is a server error, the route will respond with an HTTP `500` status code and an error message `"Server error {error message}"`.

    - Validation

    This route uses `Express-validator` to validate the request body. It checks that the password is between 5 and 20 characters in length and is a string.

    - Security

    This route uses bcrypt to securely hash the password before comparing it with the stored hash in the database. It also generates a JWT pair that includes an access token and a refresh token. The refresh token is stored in a `HttpOnly` and Secure cookie with a max age of `1 month`, and the access token expires in `10 minutes`.
    

- Route: /refreshToken

    This route handles the refresh token authentication process for refreshing an access token. It expects a valid refresh token to be sent in the request cookie and responds with a new JSON Web Token `(JWT)` pair that can be used for further authentication.

    - Usage

    To use this route, make a POST request to the endpoint `/refreshToken`. The request should contain a valid refresh token in the cookie named `"refreshToken"`.

    If the refresh token is missing or not valid, the route will respond with an HTTP `400` status code and an error message `"Refresh token missing"` and a `predicate` key with `'MISSING_TOKEN'` value, or `"Refresh token not exists or already deprecated"` and a `predicate` key with `'BAD_TOKEN'` value respectively.

    If the refresh token is valid, the route will respond with an HTTP `200` status code and a JSON object containing a new access token for further authentication. The new refresh token will also be sent in the cookie named `"refreshToken"`.

    If there is a server error, the route will respond with an HTTP `500` status code and an error message `"Server error {error message}"`.

    - Security

    This route uses JWT to generate a new access token based on the user ID extracted from the valid refresh token. The new refresh token is also generated and stored in a `HttpOnly` and Secure cookie with a max age of `1 month`. The access token expires in `10 minutes`.

    Note: This route requires the user to have a valid refresh token, which is obtained upon successful login or previous refresh token request.

    
- Route: /checkEmail

    This route checks whether a user with a given email address is registered in the system or not. It expects the email address of the user to be sent in the request body and responds with a JSON object containing a message and a predicate indicating whether the user exists or not.

    - Usage

    To use this route, make a POST request to the endpoint `/checkEmail` with the following parameter in the request body:

        email: The email address of the user to check

    If the user is registered, the route will respond with an HTTP `200` status code and a JSON object containing the message `"User registered"` and a `predicate` key with `EXIST` value.

    If the user is not registered, the route will respond with an HTTP `401` status code and a JSON object containing the message `"User not registered"` and a `predicate` key with `NOT_EXISTS` value.

    If the user email is incorrect or missing, the route will respond with an HTTP `400` status code and a JSON object containing the error message and a `predicate` key with `INCORRECT` value.

    If there is a server error, the route will respond with an HTTP `500` status code and an error message `"Server error {error message}"`.


- Route: /resetPassword

    This route handles the password reset process. It expects the user to be authenticated and sends an email with a password reset link to the user's email address. The link will redirect the user to a page where they can enter a new password.

    - Usage

    To use this route, make a POST request to the endpoint `/resetPassword` with an authenticated user. The route will generate a password reset token and send an email to the user's email address with a link to reset their password.

    If the user is not authenticated, the route will respond with an HTTP `401` status code and an error message `"User not registered"`, and a `predicate` key with a value of `NOT_EXIST`.

    If the user email is incorrect or missing, the route will respond with an HTTP `400` status code and a JSON object containing the error message and a `predicate` key with a value of `INCORRECT`.

    If there is a server error, the route will respond with an HTTP `500` status code and an error message `"Server error {error message}"`.

    - Email

    This route uses `Nodemailer` to send emails. The email template is an HTML file that includes a reset password button. When the user clicks the button, they will be redirected to a page where they can enter a new password.

    - Security

    This route generates a password reset token that is stored in the database. The token is unique to the user and expires in `1 hour`. The token is used to validate the password reset request and to prevent unauthorized password resets.
    
    
- Route: /setPassword

    This route handles the password reset process. It expects a token and a new password to be sent in the request body, and responds with a success message if the password reset is successful.

    - Usage

    To use this route, make a POST request to the endpoint `/setPassword` with the following parameters in the request body:

        password: The new password to set for the user account
        token: The reset password token received by the user in the email

    If the reset password token is not found or is incorrect, the route will respond with an HTTP `400` status code and an error message `"Reset token incorrect or expired"`, and `predicate` key with `TOKEN_EXP` value.

    If the user account is not found, the route will respond with an HTTP `507` status code and an error message `"User not found"`.

    If there is a server error, the route will respond with an HTTP `500` status code and an error message `"Server error {error message}"`.

    - Validation

    This route uses `Express-validator` to validate the request body. It checks that the password is between 5 and 20 characters in length and is a string, and that the reset password token is a non-empty string.

    - Security

    This route uses `bcrypt` to securely hash the new password before updating the user account in the database.