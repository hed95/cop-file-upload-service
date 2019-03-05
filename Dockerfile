FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

RUN apt-get update
RUN apt-get install -y --no-install-recommends graphicsmagick tesseract-ocr
RUN rm -rf /var/lib/apt/lists/*

# Bundle app source
COPY . .

EXPOSE 8181
CMD [ "npm", "start" ]
