# stage 1: build cache
FROM node as builder
COPY ["package.json", "package-lock.json", "/usr/src/"]

WORKDIR /usr/src
RUN npm install --omit=dev

COPY ["public/", "/usr/src/public"]
COPY ["views/", "/usr/src/views"]
COPY ["dist/", "/usr/src/dist"]

# stage 2: build production image
FROM node:18-alpine3.15

COPY ["package.json", "package-lock.json", "/usr/src/"]

WORKDIR /usr/src

COPY --from=builder ["/usr/src/", "/usr/src/"]
EXPOSE 3000

ENTRYPOINT ["npm", "run", "start:prod"]
