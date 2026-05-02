FROM oven/bun:latest as builder

WORKDIR /app

COPY package.json bun.lockb* ./

RUN bun install

COPY . .

FROM oven/bun:latest

WORKDIR /app

COPY --from=builder /app .

EXPOSE 3000

CMD ["bun", "run", "index.ts"]