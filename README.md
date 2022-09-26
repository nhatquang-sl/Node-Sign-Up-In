# Table of contents

- [Scripts](#scripts)
  - [Back End](#back-end)
  - [Front End](#front-end)
- [Features](#features)
  - [Forgot Password](#forgot-password)
  - [Salt Password](/back-end/docs/salt-password.md)
  - [Mediator](/back-end/docs/mediator.md)
  - [AutoMapper](/back-end/docs/auto-mapper.md)

# Scripts

## Back End
- `npm init -y`: generate `package.json`

```
npm i typescript ts-node nodemon tsc-alias tsconfig-paths prettier shx -D
npm i express @types/express -S
```
- `npx tsc --init`: create `tsconfig.json` for typescript compiler
- `tsc-alias`: replace alias paths with relative paths after typescript compilation. **Compile time (no runtime dependencies)**
- `tsconfig-paths`: load modules whose location is specified in the paths section of `tsconfig.json` or `jsconfig.json`. Both loading at **run-time** and via API are supported.
- `shx`: a wrapper around ShellJS Unix commands, providing an easy solution for simple Unix-like, cross-platform commands in npm package scripts.
- Update `package.json`
  ```
  "dev": "nodemon -r tsconfig-paths/register index.ts",
  "build": "tsc --project tsconfig.build.json && tsc-alias -p tsconfig.build.json"
  ```
- Update `tsconfig.json`
  ```
  "paths": {
    "@config": ["config"],
    "@config/*": ["config/*"]
  }
  ```

## Front End

- `npx create-react-app front-end --template typescript`: start a new Create React App project with TypeScript
- `npm install @mui/material @mui/styled-engine-sc styled-components`: install MUI with styled-components.
  - switch to `styled-components`
    - update `tsconfig.json`
      ```
      {
        "compilerOptions": {
          "paths": {
            "@mui/styled-engine": ["./node_modules/@mui/styled-engine-sc"]
          }
        },
      }
      ```
    - update `package.json`
      - replace `"@mui/styled-engine-sc": "^5.6.1"` to `"@mui/styled-engine": "npm:@mui/styled-engine-sc@latest"`
      - add
        ```
        "resolutions": {
          "@mui/styled-engine": "npm:@mui/styled-engine-sc@latest"
        },
        ```
- add front and icons to index.html
  ```
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
  ```


### Deploy
- `npm install -g vercel`: Installing vercel cli to global
- `vercel login`: Login to Vercel
- Update `package.json`
  ```
  "scripts": {
    "start": "vercel dev",
    "deploy" : "vercel deploy --prod"
  },
  ```

# Features

## [Forgot Password](https://www.notion.so/nhat-quang/Forgot-Password-2eb55da1b8d64a2985f85e17c2cf0ea4)
## [Salt Password](/back-end/docs/salt-password.md)
