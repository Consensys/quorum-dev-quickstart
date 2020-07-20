FROM nginx:1.15-alpine

# Set healthcheck route
RUN apk --no-cache add curl
HEALTHCHECK CMD curl -f http://localhost/healthcheck || exit 1

# Copy nginx conf
COPY config/default.conf /etc/nginx/conf.d/default.conf

# Copy application bundle
RUN mkdir -p /var/www/html
COPY build /var/www/html/
COPY config/config.json /var/www/html/config.json

# Runtime
EXPOSE 80
CMD nginx -g "daemon off;"

