ARG TESSERA_VERSION=latest

FROM quorumengineering/tessera:${TESSERA_VERSION}

RUN apt-get update && apt-get install -y \
  gettext \
  && rm -rf /var/lib/apt/lists/*

ENV JAVA_OPTS="-Dlogback.configurationFile=/data/logback.xml"


COPY docker-entrypoint.sh /usr/bin/
COPY data data

ENTRYPOINT ["docker-entrypoint.sh"]
