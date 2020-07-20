#default version to latest
ARG QUORUM_VERSION=2.6.0
FROM quorumengineering/quorum:$QUORUM_VERSION

ENV QUORUM_DATADIR=/data

RUN mkdir -p $QUORUM_DATADIR/keystore $QUORUM_DATADIR/geth
ADD disallowed-nodes.json $QUORUM_DATADIR/

