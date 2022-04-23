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
- `npx create-react-app my-app --template typescript`: start a new Create React App project with TypeScript
- `npm i shx -D`: is a wrapper around ShellJS Unix commands, providing an easy solution for simple Unix-like, cross-platform commands in npm package scripts.