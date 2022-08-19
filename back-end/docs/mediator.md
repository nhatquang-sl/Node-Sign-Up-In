## mediator
There are three main things in the mediator: **container**, **mediator**, **pipeline behavior**.

### container
- **handlers** property contains a list of handler that handle request.
- There are two [class decorators](https://www.typescriptlang.org/docs/handbook/decorators.html#class-decorators):
  - **RegisterHandler** add handler to **handlers** property.
  - **Authorize** add handler to **handlers** property and set required roles for that handler.

### mediator
- There are two public methods:
  - **addPipelineBehavior**: add pipeline behavior to run before/after each command.
  - **send**: receive a command then pick a corresponding handler in the **container** to handle that command.

### pipeline behavior
- Attach additional behavior before and/or after each request, e.g. logging, validation, caching, authorization and so on.