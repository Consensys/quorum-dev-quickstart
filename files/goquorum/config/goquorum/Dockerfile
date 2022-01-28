ARG QUORUM_VERSION=latest

FROM quorumengineering/quorum:${QUORUM_VERSION}

RUN apk add --no-cache dumb-init

COPY entrypoint.sh entrypoint.sh
COPY data data

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["/entrypoint.sh"]