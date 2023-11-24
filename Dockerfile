# Freeplanningpoker
# Version 0.0.1
# Copyright 2023 Benjamin Riezler
# 
# Freeplanningpoker is free software: you can redistribute it and/or modify
# it under the terms of the GNU Lesser General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# 
# Freeplanningpoker is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Lesser General Public License for more details.
# 
# You should have received a copy of the GNU Lesser General Public License
#along with MyLibrary. If not, see <http://www.gnu.org/licenses/>.


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