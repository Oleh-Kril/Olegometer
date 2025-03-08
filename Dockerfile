# Stage 2: Serve the static files using Nginx
FROM nginx:stable-alpine

# Copy the exported static files from the builder stage
COPY --from=builder /app/out /usr/share/nginx/html

# Copy the custom Nginx config file
COPY default.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
