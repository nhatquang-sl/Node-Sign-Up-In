# User submit their credentials
Upon receiving user-submitted credentials, the login page proceeds to verify their validity:

- If the credentials are **invalid**, the login page displays an error message next to the relevant input field to assist the user.
- If the credentials are **valid**, the login page sends them to the server for further validation.
  - If the server returns an **error**, the login page presents an error message to the user via a snackbar notification.
  - If the server returns a **success** response, the login page utilizes the `useEffect` hook, which depends on `AuthState.type`, to seamlessly redirect the user to the `Dashboard` page.

# Technical
## createSlice
Utilizing the `createSlice` function, the `AuthState` is initialized and the `setAuth` reducer is defined to accept an access token. Upon receiving the token, it is decoded and the `AuthState` is updated with the decoded value.

The `createSlice` function also **conveniently generates an action creator and corresponding action type** associated with the `setAuth` reducer.

```typescript
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state: AuthState, action: PayloadAction<string>) => {
      const accessToken = action.payload;
      const tokenData = (accessToken ? jwtDecode(accessToken) : {}) as TokenData;

      state.id = isNaN(tokenData?.id) ? -1 : parseInt(tokenData?.id + '');
      state.accessToken = accessToken ?? '';
      state.firstName = tokenData?.firstName ?? '';
      state.lastName = tokenData?.lastName ?? '';
      state.emailAddress = tokenData?.emailAddress ?? '';
      state.type = tokenData?.type ?? '';
      state.roles = tokenData?.roles ?? [];
      state.exp = tokenData?.exp ?? 0;
      state.iat = tokenData?.iat ?? 0;
      console.log(state);
    },
  }
});
```

## injectEndpoints (createApi)
The `injectEndpoints` function is used to add a `login` endpoint that manages sending user credentials to the server. After obtaining the `accessToken` from the server, it is passed to the `setAuth` action for further handling.

```typescript
export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<UserAuthDto, UserLoginDto>({
      query: (userLogin: UserLoginDto) => ({
        url: `auth/login`,
        method: 'POST',
        body: userLogin,
      }),
      async onQueryStarted(userLogin, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAuth(data.accessToken));
        } catch (err) {
          const res = (err as QueryFulfilledRejectionReason<BaseQueryFn>).error as {
            status: number;
            data: { message: string };
          };
          const status = res?.status ?? 0;
          if ([400, 401].includes(status)) {
            const message = res?.data.message;
            message && dispatch(showSnackbar(message, 'error'));
          }
        }
      },
    })
  }),
});

export const { useLoginMutation } = authApiSlice;
```


