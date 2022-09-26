# Table of contents
- [What is Object Mapping?](#what-is-object-mapping)
- [What is AutoMapper?](#what-it-automapper)
- [Why does it exist?](#why-does-it-exist)
- [Problem in TypeScript](#problem-in-typescript)
- [AutoMapper in TypeScript](#automapper-in-typescript)

## What is Object Mapping?
- Sometimes called Transformation
- ORM implements responsibility of mapping the Object to Relational Model
- DTO (Data Transfer Object): used to map the data from business model and return to presentation.

| Presentation <-> | DTO | <-> Business |
| ----------- | ----------- | ----------- |
|   |  |  |

## What it AutoMapper?
- Original .NET AutoMapper
- Mapping by Convention
- Opinionated

```typescript:dsfas
// database model
export class User {
    username: string;
    firstName: string;
    lastName: string;
    password: string;
}

// model is passed to client
export class UserDto {
    username: string;
    name: string;

    static fromUser(user: User): UserDto {
        return new UserDto {
            username: user.username,
            name: `${user.firstName} ${user.lastName}`
        };
    }
}
// controller
const user = getUserFromDatabase();
return UserDto.fromUser(user);
```
The above code is manual mapping and there are some problems here:
- When we have 10 models that need map to `UserDto`, we have to repeat the static function 10 times.
- The `UserDto` is dependent on User model. If we have other models the UserDto have to know all of them => it's not scalable, maintainable (have to write a lot of code).
- Repeat manual mapping multiple times is a boring work.
We should apply a mapping by convention to avoid the manual mapping. 
Opinionated mean that we have to follow the convention.

## Why does it exist?
- Avoid boring tasks of mapping Domain models to DTOs
- Separate of Concerns
- Conventions over Configurations

### Build a simple mapper

```typescript
const user = {
    firstName: "Quang",
    lastName: "Nguyen",
    email: "quang.nguyen@gmail.com",
    age: 30,
    job: {
        title: "developer",
        salary: 1234
    }
}

/**
 * {
 *  first,
 *  last,
 *  full,
 *  isAdult,
 *  job,
 *  monthlySalary
 * }
 */
 
const mapDestinationConfig = {
    first: source => source.firstName,
    last: source => source.lastName,
    full: source => source.firstName + ' ' + source.lastName,
    isAdult: source => source.age > 18,
    job: source => source.job.title,
    monthSalary: source => source.job.salary / 12
}

const dto = {};

for(const configKey in mapDestinationConfig) {
    dto[configKey] = mapDestinationConfig[configKey](user);
}

console.log(dto);
```

## Problem in TypeScript
- Dynamic Typings: it is static typing but essentially, it's still JavaScript
- Weak Reflection
- Inconsistent metadata with different tsconfig
## AutoMapper in TypeScript