# Redux
Redux is a global state manager that allows you manage your app state in a single place which can be very useful
- store is the whole state of app in an immutable object tree, and really the intended pattern for redux is just to have a single store for your application.
- Reducers are functions that take the current state and an action as arguments, and return a new state result. In other words, (state, action) => newState.
- reducers must always follow some special rules:
  - They should only calculate the new `state` value based on the `state` and `action arguments`
  - They are not allowed to modify the existing `state`. Instead, they must make *immutable updates*, by copying the existing `state` and making changes to the copied values.
  - They must not do any asynchronous logic or other "side effects"
- slice comes from splitting up redux state objects into multiple slices of state. So a slice is really a collection of reducer logic and actions for a single feature in the app. For example, a blog might have a slice for posts and another slice for comments. You would handle the logic of each differently, so they each get their own slice.

# Redux Toolkit
- Redux Toolkit is an easier modern way to implement the power of redux as a global state manager.
- Redux Toolkit addresses several **common complains** about redux including :
  - complex store configuration
  - too many added packages
  - too much code to implement

## Install Redux Toolkit
`yarn add @reduxjs/toolkit react-redux`

## Normalization
- Normalized state structure is a recommended approach for storing items.
- And normalization 
  - means no duplication of data 
  - and it also means keeping the items stored in a lookup table by item id

### [Normalized state shape](https://redux.js.org/usage/structuring-reducers/normalizing-state-shape)
```JSON
{
  // The unique IDs of each item. Must be strings or numbers
  ids: []
  // A lookup table mapping entity IDs to the corresponding entity objects
  entities: {
  }
}
```
- Normalized state shape is comprised of an object with an `ids` array and then a nested `entities` object that contains all of the items
- The best part of using normalized data with Redux Toolkit is that Redux Toolkit offers a create entity adapter api and that will make your slices less complicated and easier to manage.
- [Normalizing with createEntityAdapter](https://redux-toolkit.js.org/usage/usage-guide#normalizing-with-createentityadapter)
- [createEntityAdapter API](https://redux-toolkit.js.org/api/createEntityAdapter)

## [createApi](https://redux-toolkit.js.org/rtk-query/api/createApi)
The `api-slice` is where we will create our methods to interact with the API. It essentially 
- **replaces something like `axios`** 
- and **pulls that code out of our component logic**  
and over here in a separate `api-slice`

### [Using auto-generated React Hooks](https://redux-toolkit.js.org/rtk-query/usage-with-typescript#using-auto-generated-react-hooks)