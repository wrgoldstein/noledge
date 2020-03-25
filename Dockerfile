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
RUN mkdir /root/.ssh/
RUN apt-get update && apt-get install -y openssh-client
RUN apt-get update && apt-get install -y git

# RUN echo "${DEPLOY_SECRET}" > /root/.ssh/id_rsa
# RUN chmod 700 /root/.ssh/id_rsa
# make sure your domain is accepted
RUN touch /root/.ssh/known_hosts
RUN ssh-keyscan -t rsa github.com > /root/.ssh/known_hosts
# RUN git clone "${REPO}"
RUN npm install
RUN npm run build
CMD [ "npm", "start" ]
