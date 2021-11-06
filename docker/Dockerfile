FROM node:16

USER root
WORKDIR /root
COPY ./ ./judgeq

RUN cd ./judgeq \
  && yarn \
  && yarn build \
  && bash post_build.sh \
  && cp docker/docker_entry.sh /root/docker_entry.sh \
  && cp -a dist /root/ \
  && cp -a node_modules /root/ \
  && cp package.json /root/ \
  && rm -rf /root/judgeq

ENTRYPOINT ["/root/docker_entry.sh"]

CMD ["judgeq-api"]
