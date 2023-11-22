### STAGE 1: Build ###
# FROM node:slim AS build
FROM node:alpine as build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install --save --legacy-peer-deps
COPY . .
RUN npm run build
### STAGE 2: Run ###
FROM nginx:alpine

COPY --from=build /usr/src/app/dist/free-planning-poker /usr/share/nginx/html

EXPOSE 80