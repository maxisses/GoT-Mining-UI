FROM node:15.8.0-alpine3.11
WORKDIR /app

COPY package.json /app
RUN npm install --only=prod
RUN addgroup -S gotmining && adduser -S max -G gotmining
USER max
COPY . .

ENV NODE_ENV production
ENV PORT 3000
ENV GPT2SERVICEURL https://gpt2forgot-35x2sjfesq-ew.a.run.app

EXPOSE 3000

CMD ["npm", "start"]
