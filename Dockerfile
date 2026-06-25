# Step 1: Build React app
FROM node:20-alpine AS build


WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Step 2: Serve with Nginx (production standard)
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

# optional: custom nginx config (not required for basic setup)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]