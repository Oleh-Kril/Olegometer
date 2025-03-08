# Stage 1: Build the static site
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Build the app (this uses your next.config.js setting "output: 'export'")
RUN npm run build

# Stage 2: Serve the static files using Nginx
FROM nginx:stable-alpine
# Copy the exported static files from the builder stage
COPY --from=builder /app/out /usr/share/nginx/html

# Expose port 80 and start Nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
