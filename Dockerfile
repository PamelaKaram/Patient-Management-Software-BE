FROM node:14.17 AS deps

RUN npm install -g nodemon

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json package-lock.json ./

RUN npm install

RUN npm i -g sequelize-cli

FROM node:14.17 AS runner
WORKDIR /srv/app

# Bundle app source
COPY . .
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 8080

CMD ["npm", "run", "dev"]