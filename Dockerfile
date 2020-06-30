FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Environment variables
ENV NODE_ENV=null
ENV PORT=3000
ENV STRIP_TAGS_JSONP=")]}',\n"

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "bin/www" ]