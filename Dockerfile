# stage 1: build cache
FROM node:18-alpine3.15 as builder
COPY ["package.json", "package-lock.json", "/usr/src/deps/"]

WORKDIR /usr/src/deps
RUN npm install --omit=dev

# stage 2: build production image
FROM node:18-alpine3.15

VOLUME ["/usr/src/.env"]

WORKDIR /usr/src
EXPOSE 3000

COPY --from=builder ["/usr/src/deps/", "/usr/src/"]
COPY ["public/", "/usr/src/public"]
COPY ["views/", "/usr/src/views"]
COPY ["dist/", "/usr/src/dist"]

ENTRYPOINT ["node", "dist/main.js"]
