FROM node:22-alpine

WORKDIR /app

# Installer wget for healthchecks
RUN apk add --no-cache wget

# Kopier package files
COPY package*.json ./

# Installer alle dependencies
RUN npm ci

# Kopier applikasjon
COPY . .

# Bygg Next.js
RUN npm run build

# Eksponer port
EXPOSE 3000

# Start applikasjon
CMD ["npm", "start"]