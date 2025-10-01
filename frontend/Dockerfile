# Dockerfile for production use
# Builder stage
FROM node:20.10.0-alpine3.17 AS builder

ENV DOCKER_BUILDKIT=1

# 1. Build time environment
ARG REACT_APP_NODE_BACKEND_URI
ENV REACT_APP_NODE_BACKEND_URI=$REACT_APP_NODE_BACKEND_URI

WORKDIR /app

COPY . . 
RUN npm ci -s
RUN npm run build

# Production stage
FROM nginx:stable-alpine

COPY --from=builder /app/build /usr/share/nginx/html

# Copy the default nginx.conf provided by tiangolo/node-frontend
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
