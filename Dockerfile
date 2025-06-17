# Development stage
FROM node:22-alpine AS development
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy app files
COPY . .

# Production build stage
FROM node:22-alpine AS builder
WORKDIR /app

# Copy dependencies and source
COPY package*.json ./
RUN npm ci
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine AS production
WORKDIR /app

ENV NODE_ENV production

# Copy built application
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

ENV PORT 3000
ENV HOST 0.0.0.0

CMD ["npm", "start"]