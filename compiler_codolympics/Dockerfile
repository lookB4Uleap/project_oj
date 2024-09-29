FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json yarn.lock ./ 
RUN yarn
COPY . .

FROM base as builder
WORKDIR /app
RUN yarn build

FROM node:20-alpine AS final
WORKDIR /app
COPY package*.json yarn.lock ./ 
RUN yarn install --production && apk update && apk add --no-cache g++ gcc python3 openjdk17
COPY --from=builder ./app/dist ./dist
CMD [ "yarn", "start" ]