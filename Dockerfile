FROM nodesource/node:6

RUN npm install -g typings
RUN npm install -g gulp-cli
RUN npm install -g typescript
RUN npm install
RUN typings install

ADD . .
RUN gulp ts

EXPOSE 3000 

CMD ["node", "bin/www"]
