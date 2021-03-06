FROM quay.io/ukhomeofficedigital/cop-node:11

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm ci

RUN apt-get update && apt-get install -y --no-install-recommends \
  tesseract-ocr \
  graphicsmagick \
  ghostscript \
  && rm -rf /var/lib/apt/lists/*

# Bundle app source
COPY . .

# Build app
RUN npm run build

USER 1000

EXPOSE 8181

CMD [ "npm", "start" ]
