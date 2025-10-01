# Dockerfile for production use
# Builder stage
FROM node:20.10.0-alpine3.17 AS builder

WORKDIR /app

COPY package*.json ./

# Install production dependencies.
RUN npm ci -s
RUN npm install -g typescript

# Copy local code to the container image.
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM node:20.10.0-alpine3.17

WORKDIR /app

COPY package*.json ./

# Install production dependencies.
RUN npm ci -s

# Copy built app from builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 8000

# Run the web service on container startup.
CMD ["npm", "start"]