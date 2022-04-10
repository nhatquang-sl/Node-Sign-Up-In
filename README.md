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
## Front End
- `npx create-react-app my-app --template typescript`: start a new Create React App project with TypeScript
- `npm install --save @auth0/auth0-spa-js`: install the Auth0 SPA SDK