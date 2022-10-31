## JWT (Json Web Tokens)
JWT can be considered to be a form of user identification that is issued after the initial user authentication takes place.

## Access Token and a Refresh Token
When a user completes their login process and they are authenticated, our REST API will issue the client application an access token and a refresh token.
### Access Token
- given a **short time** before it expires. e.g 5, 10 minutes.
- Our API will send and receive access token as JSON data. 
- It is recommended for front-end client applications to only **store access token in memory**. So they will be automatically lost when the app is closed. They should not be stored in `localStorage` or in a `cookie`. Essentially, if you can store it somewhere with JavaScript a hacker can also retrieve it with JavaScript. **Just keep access token in memory which you might also refer to as the current application state**.
### Overall
- Issued at Authorization
- Client uses for API access until expires
- Verified with Middleware
The access token process involves issuing an access token during user authorization. The users application can then access our rest API's protected routes with the access token until it expires. Our API will verify the access token with middleware every time the access token is used to make request.

### Refresh Token
- given a longer duration before it expires, possibly several hours, a day or even days.
- Our API will issue **refresh token in an http only cookie**. This type of cookie is not accessible with JavaScript.
- need to have an expiration which will then require users to login again.
- should not have the ability to issue new refresh token because that essentially grants indefinite access if a refresh token falls into the wrong hands.
### Overall
- Issued at Authorization
- Client uses to request new Access Token
- Verified with endpoint and database
- Must be allowed to expire or logout
The refresh token is also issued during use authorization. Our REST API refresh endpoint will verify the token and cross-reference the refresh token in our database too. Storing a reference to the refresh token in the database will allow refresh token to be terminated early if the user decides to logout. And again refresh token need to be allowed to expire. So indefinite access cannot be gained.

## Generate secret keys
We need to create two secret keys for encrypt access token and refresh token.
```
node
require('crypto').randomBytes(64).toString('hex');
```