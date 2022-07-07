# Table of contents

- [Scripts](#scripts)
  - [Back End](#back-end)
  - [Front End](#front-end)
- [Features](#features)
  - [Forgot Password](#forgot-password)

# Scripts

## Back End

- `npm init -y`: generate `package.json`
- `npm i typescript -D`: install TypeScript
- `npx tsc --init`: create `tsconfig.json` for typescript compiler
- `npm i ts-node -D`: allow us compile and run the typescript file
- `npm i ts-node-dev -D`: allow auto reload
  - `"start": "tsnd --respawn src/server.ts"`
- `npm install express -S`, `npm install @types/express -D`
- `npm i prettier -D`
- `npm i module-alias -D`: Create aliases of directories and register custom module paths in NodeJS
  - Update `package.json`
  ```
  "_moduleAliases": {
    "@config": "./config"
  }
  ```
  - Update `tsconfig.json`
  ```
  "paths": {
    "@config": ["config"],
    "@config/*": ["config/*"]
  }
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
- Add `vercel.json`
  ```
  {
    "version": 2,
    "builds": [
        {
            "src": "index.ts",
            "use": "@vercel/node"
        }
    ],
    "routes": [
        {
            "src": "/(.*)",
            "dest": "index.ts"
        }
    ]
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
- `npm i shx -D`: is a wrapper around ShellJS Unix commands, providing an easy solution for simple Unix-like, cross-platform commands in npm package scripts.

# Features

## [Forgot Password](https://www.notion.so/nhat-quang/Forgot-Password-2eb55da1b8d64a2985f85e17c2cf0ea4)
