#default version to latest
ARG QUORUM_VERSION=2.7.0
FROM quorumengineering/quorum:$QUORUM_VERSION

# Expose services ports
# 8545 HTTP JSON-RPC
# 8546 WS JSON-RPC
# 8547 HTTP GraphQL
# 30303 P2P
# 50400 Raft
EXPOSE 8545 8546 8547 30303 50400

ENV QUORUM_DATADIR=/data
ENV QUORUM_SEED_DATADIR=/quorum
ENV QUORUM_CONSENSUS=istanbul

RUN mkdir -p $QUORUM_SEED_DATADIR/keystore $QUORUM_SEED_DATADIR/geth
ADD disallowed-nodes.json static-nodes.json permissioned-nodes.json $QUORUM_SEED_DATADIR/


