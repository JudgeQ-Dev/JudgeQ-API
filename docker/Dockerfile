FROM node:16

USER root
WORKDIR /root
COPY ./ ./judgeq

RUN cd ./judgeq \
  && yarn \
  && yarn build \
  && rm -rf ./node_modules \
  && yarn --production \
  && mv ./docker/docker_entry.sh /root/docker_entry.sh \
  && mv ./dist /root/ \
  && mv ./node_modules /root/ \
  && rm -rf /root/judgeq

ENTRYPOINT ["/root/docker_entry.sh"]

CMD ["/bin/bash"]
