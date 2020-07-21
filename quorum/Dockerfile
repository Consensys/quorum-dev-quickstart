#default version to latest
ARG QUORUM_VERSION=2.7.0
FROM quorumengineering/quorum:$QUORUM_VERSION

ENV QUORUM_DATADIR=/data
ENV QUORUM_SEED_DATADIR=/quorum
ENV QUORUM_CONSENSUS=istanbul

RUN mkdir -p $QUORUM_SEED_DATADIR/keystore $QUORUM_SEED_DATADIR/geth
ADD disallowed-nodes.json static-nodes.json permissioned-nodes.json $QUORUM_SEED_DATADIR/


