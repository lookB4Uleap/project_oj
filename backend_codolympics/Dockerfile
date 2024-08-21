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
RUN yarn install --production
COPY --from=builder ./app/dist ./dist
CMD [ "yarn", "start" ]