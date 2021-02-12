FROM node:15.8.0-alpine3.11
USER max
WORKDIR /app

COPY package.json /app
RUN npm install --only=prod
COPY . .

ENV NODE_ENV production
ENV PORT 3000
ENV GPT2SERVICEURL https://gpt2forgot-35x2sjfesq-ew.a.run.app

EXPOSE 3000

CMD ["npm", "start"]
