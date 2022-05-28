FROM node:16 AS build

USER root
WORKDIR /app
COPY ./ ./judgeq

RUN cd judgeq \
  && npm i -g pnpm \
  && pnpm i \
  && pnpm build \
  && rm -rf node_modules \
  && pnpm i --production \
  && cp docker/docker_entry.sh /app/docker_entry.sh \
  && cp -a dist /app/ \
  && cp -a node_modules /app/ \
  && cp package.json /app/ \
  && cp config-example.yaml /app/ \
  && rm -rf /app/judgeq

FROM node:16-alpine

USER root
WORKDIR /app

COPY --from=build /app ./

RUN apk add tzdata

ENTRYPOINT ["/app/docker_entry.sh"]

CMD ["primary"]
