FROM node:erbium-alpine as build
ENV DB_URI localhost:27017
WORKDIR /app
COPY package.json /app/package.json
RUN yarn install --prefer-offline
COPY index.js /app/index.js

FROM node:erbium-alpine
WORKDIR /app
COPY --from=build /app .
CMD ["node", "index.js"]
