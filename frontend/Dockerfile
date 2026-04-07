# Single stage for development simplicity
FROM node:22-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build Next.js application
RUN npm run build

# Set environment variables
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

# Expose port
EXPOSE 3000

# Start Next.js application
CMD ["npm", "start"]
