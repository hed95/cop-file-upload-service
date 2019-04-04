FROM node:11

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

RUN apt-get update && apt-get install -y --no-install-recommends \
  tesseract-ocr \
  graphicsmagick \
  ghostscript \
  && rm -rf /var/lib/apt/lists/*

# Bundle app source
COPY . .

# Build app
RUN npm run build

EXPOSE 8181

CMD [ "npm", "start" ]
