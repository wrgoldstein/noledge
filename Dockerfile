FROM node:13
ENV DEPLOY_SECRET secret
ENV REPO repo
ENV GOOGLE_CLIENT_ID client_id
EXPOSE 3000
EXPOSE 10000
WORKDIR /usr/src/app
COPY package*.json ./
COPY static static
COPY src src
COPY rollup.config.js rollup.config.js
RUN apt-get update && apt-get install -y openssh-client
RUN apt-get update && apt-get install -y git
RUN ssh-keyscan -H github.com > known_hosts
RUN npm install
RUN npm run build
CMD [ "npm", "start" ]
