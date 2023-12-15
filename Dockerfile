FROM node:19-alpine

COPY back-end /app/back-end/
COPY front-end /app/front-end/

WORKDIR /app/front-end
RUN npm i

WORKDIR /app/back-end
RUN npm i && npm run build

WORKDIR /app/back-end/dist/back-end

CMD ["node", "index.js"]