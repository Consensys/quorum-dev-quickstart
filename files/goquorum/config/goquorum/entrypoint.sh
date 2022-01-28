#!/bin/sh

set -o errexit
set -o nounset
set -o pipefail

GOQUORUM_CONS_ALGO=`echo "${GOQUORUM_CONS_ALGO}" | tr '[:lower:]'`

if [ "istanbul" == "$GOQUORUM_CONS_ALGO" ];
then
    echo "Using istanbul for consensus algorithm..."
    export CONSENSUS_ARGS="--istanbul.blockperiod 5 --mine --miner.threads 1 --miner.gasprice 0 --emitcheckpoints"
    export QUORUM_API="istanbul"
elif [ "qbft" == "$GOQUORUM_CONS_ALGO" ];
then
    echo "Using qbft for consensus algorithm..."
    export CONSENSUS_ARGS="--istanbul.blockperiod 5 --mine --miner.threads 1 --miner.gasprice 0 --emitcheckpoints"
    export QUORUM_API="istanbul,qbft"
elif [ "raft" == "$GOQUORUM_CONS_ALGO" ];
then
    echo "Using raft for consensus algorithm..."
    export CONSENSUS_ARGS="--raft --raftblocktime 300 --raftport 53000"
    export QUORUM_API="raft"
fi

if [[ ! -d /data/geth ]];
then
    echo "Initializing geth data directory ..."
    geth --datadir=/data init /data/${GOQUORUM_CONS_ALGO}Genesis.json;
fi

cp /config/keys/accountkey /data/keystore/key;
cp /config/keys/nodekey /data/geth/nodekey;

export ADDRESS=$(grep -o '"address": *"[^"]*"' /config/keys/accountkey | grep -o '"[^"]*"$' | sed 's/"//g')


if [[ ! -z ${QUORUM_PTM:-} ]];
then
    echo "Checking tessera is up ..."
    for i in $(seq 1 100)
    do
    if [ "I'm up!" == "$(wget --timeout 10 -qO- --proxy off ${QUORUM_PTM}:9000/upcheck)" ];
        then break
    else
        echo "Waiting for Tessera..."
        sleep 10
    fi
    done
    
    ADDITIONAL_ARGS="${ADDITIONAL_ARGS:-} --ptm.timeout 5 --ptm.url http://${QUORUM_PTM}:9101 --ptm.http.writebuffersize 4096 --ptm.http.readbuffersize 4096 --ptm.tls.mode off"
fi

geth \
--datadir /data \
--nodiscover \
--permissioned \
--verbosity 3 \
$CONSENSUS_ARGS \
--syncmode full --nousb \
--metrics --pprof --pprof.addr 0.0.0.0 --pprof.port 9545 \
--networkid ${QUORUM_NETWORK_ID:-1337} \
--http --http.addr 0.0.0.0 --http.port 8545 --http.corsdomain "*" --http.vhosts "*" --http.api admin,trace,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,$QUORUM_API \
--ws --ws.addr 0.0.0.0 --ws.port 8546 --ws.origins "*" --ws.api admin,trace,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,$QUORUM_API \
--port 30303 \
--identity ${HOSTNAME}-${GOQUORUM_CONS_ALGO} \
--unlock ${ADDRESS} \
--allow-insecure-unlock \
--password /data/passwords.txt \
${ADDITIONAL_ARGS:-} \
2>&1 | tee -a /var/log/quorum/geth-$(hostname -i).log