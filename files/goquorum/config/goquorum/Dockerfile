ARG QUORUM_VERSION=latest

FROM quorumengineering/quorum:${QUORUM_VERSION}

RUN apk add --no-cache curl

COPY docker-entrypoint.sh /usr/local/bin/
COPY data data

RUN mkdir -p /data /var/log/quorum \
    && addgroup -g 1000 quorum \
    && adduser -u 1000 -G quorum -s /bin/sh -D quorum \
    && chown -R quorum:quorum /data /var/log/quorum 
USER quorum

ENTRYPOINT ["docker-entrypoint.sh"]