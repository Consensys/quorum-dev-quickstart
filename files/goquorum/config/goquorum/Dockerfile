ARG QUORUM_VERSION=latest

FROM quorumengineering/quorum:${QUORUM_VERSION}

RUN apk add --no-cache curl

COPY docker-entrypoint.sh /usr/local/bin/
COPY data data

ENTRYPOINT ["docker-entrypoint.sh"]