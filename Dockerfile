FROM node:8.10
# Create app directory
WORKDIR /usr/src/app
COPY . .

RUN cd server;npm install -g cnpm --registry=https://registry.npm.taobao.org && cnpm install;cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
#RUN npm run build

EXPOSE 3000
#CMD [ "npm", "run", "server" ]

ENTRYPOINT cd server ; ls -l ; npm run start
