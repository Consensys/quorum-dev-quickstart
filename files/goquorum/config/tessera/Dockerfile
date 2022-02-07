ARG TESSERA_VERSION=latest

FROM quorumengineering/tessera:${TESSERA_VERSION}

ENV JAVA_OPTS="-Dlogback.configurationFile=/data/logback.xml"

COPY docker-entrypoint.sh /usr/bin/
COPY data data

ENTRYPOINT ["docker-entrypoint.sh"]