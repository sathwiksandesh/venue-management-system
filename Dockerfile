# Stage 1: Build the React app
FROM node:18-alpine as build-stage
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy the rest of the code (including your vite.config and tailwind.config)
COPY . .

# Run the build script from your package.json
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
# Vite builds to 'dist' by default, which matches your scripts
COPY --from=build-stage /app/dist /usr/share/nginx/html

# We still need the nginx.conf to handle the $PORT variable for Google Cloud
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]