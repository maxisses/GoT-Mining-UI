FROM registry.access.redhat.com/ubi8/nodejs-12
WORKDIR /opt/app-root/src

COPY package.json /opt/app-root/src
RUN npm install --only=prod
COPY . .

ENV NODE_ENV production
ENV PORT 3000
ENV GPT2SERVICEURL https://gpt2forgot-35x2sjfesq-ew.a.run.app

EXPOSE 3000

CMD ["npm", "start"]
