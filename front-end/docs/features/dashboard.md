# Overview
This page just display an User Session list with pagination

# Technical
## createEntityAdapter
I utilized `createEntityAdapter` to generate reducer functions and selectors to facilitate CRUD operations on a normalized state structure.

## injectEndpoints (createApi)
The `injectEndpoints` function is used to add a `getSessions` endpoint, which retrieves paginated sessions from the server.

In this scenario, instead of utilizing the `useGetSessionsQuery` hook, the `getSessions` endpoint is called directly. This approach eliminates the need to manage and update pagination within the component.

```typescript
const fetchSessions = async (page: number, size: number) => {
    setIsLoading(true);
    const result = await dispatch(sessionsApi.endpoints.getSessions.initiate({ page, size }));
    if (result.data) dispatch(setSessionsPage(result.data));
    setIsLoading(false);
};
```