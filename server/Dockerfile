FROM node:20.11.1-alpine3.19

# Add required dependencies for canvas and node-gyp
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    pixman-dev \
    build-base

WORKDIR /server

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json

RUN npm install

COPY . .

CMD [ "npm", "start" ]
