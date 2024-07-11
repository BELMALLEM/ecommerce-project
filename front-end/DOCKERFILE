# Stage 1: Build
FROM node:14 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Stage 2: Serve
FROM nginx:1.23
COPY --from=build /app/dist/front-end /usr/share/nginx/html
EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]