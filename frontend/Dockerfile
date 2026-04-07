# Build stage
FROM node:22-alpine as builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies with legacy peer deps flag as per package.json instructions
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build Next.js application
RUN npm run build


# Runtime stage
FROM node:22-alpine

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1000 appgroup && \
    adduser -D -u 1000 -G appgroup appuser

# Install only runtime dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps --production=false && \
    npm cache clean --force

# Copy built application from builder
COPY --from=builder --chown=appuser:appgroup /app/.next ./.next
COPY --from=builder --chown=appuser:appgroup /app/public ./public

# Set environment variables
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

# Switch to non-root user
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD curl -f http://localhost:3000/ || exit 1

# Expose port
EXPOSE 3000

# Start Next.js application
CMD ["npm", "start"]
