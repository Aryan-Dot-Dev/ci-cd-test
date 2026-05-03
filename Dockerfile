FROM oven/bun:latest

WORKDIR /app

COPY app/package.json ./
RUN bun install --production

COPY app .

EXPOSE 3000

CMD ["bun", "index.ts"]