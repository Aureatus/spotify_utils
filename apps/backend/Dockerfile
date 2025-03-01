FROM oven/bun:1
WORKDIR /app

# Copy root lock file and backend package files
COPY bun.lock bun.lock
COPY apps/backend/package.json package.json

# Install dependencies
RUN bun install

# Copy only the backend code
COPY apps/backend .

ENV NODE_ENV=production

EXPOSE 3000
CMD ["sh", "-c", "bun drizzle-kit migrate && bun run start"]