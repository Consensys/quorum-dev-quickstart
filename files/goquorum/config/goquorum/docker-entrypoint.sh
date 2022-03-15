#!/bin/sh

set -o errexit
set -o nounset
set -o pipefail

GOQUORUM_CONS_ALGO=`echo "${GOQUORUM_CONS_ALGO:-qbft}" | tr '[:lower:]'`
GENESIS_FILE=${GENESIS_FILE:-"/data/${GOQUORUM_CONS_ALGO}-${GOQUORUM_GENESIS_MODE}-genesis.json"}
VERBOSITY=${VERBOSITY:-3}
mkdir -p /data
cp -R /config/* /data


echo "Applying ${GENESIS_FILE} ..."
geth --nousb --verbosity $VERBOSITY --datadir=/data init ${GENESIS_FILE}; 

mkdir -p /data/keystore/

cp /config/keys/accountKeystore /data/keystore/key;
cp /config/keys/nodekey /data/geth/nodekey;

export ADDRESS=$(grep -o '"address": *"[^"]*"' /config/keys/accountkey | grep -o '"[^"]*"$' | sed 's/"//g')

if [ "istanbul" == "$GOQUORUM_CONS_ALGO" ];
then
    echo "Using istanbul for consensus algorithm..."
    export CONSENSUS_ARGS="--istanbul.blockperiod 5 --mine --miner.threads 1 --miner.gasprice 0 --emitcheckpoints"
    export QUORUM_API="istanbul"
elif [ "qbft" == "$GOQUORUM_CONS_ALGO" ];
then
    echo "Using qbft for consensus algorithm..."
    export CONSENSUS_ARGS="--istanbul.blockperiod 5 --mine --miner.threads 1 --miner.gasprice 0 --emitcheckpoints"
    export QUORUM_API="istanbul"
elif [ "raft" == "$GOQUORUM_CONS_ALGO" ];
then
    echo "Using raft for consensus algorithm..."
    export CONSENSUS_ARGS="--raft --raftblocktime 300 --raftport 53000"
    export QUORUM_API="raft"
elif [ "clique" == "$GOQUORUM_CONS_ALGO" ];
then
    echo "Using clique for consensus algorithm..."
    export CONSENSUS_ARGS="--mine --mine --miner.threads 1 --miner.gasprice 0 --emitcheckpoints"
    export QUORUM_API="clique"
fi


export ADDRESS=$(grep -o '"address": *"[^"]*"' /config/keys/accountkey | grep -o '"[^"]*"$' | sed 's/"//g')



if [[ ! -z ${QUORUM_PTM:-} ]];
then
    echo -n "Checking tessera is up ... "
    
    curl \
        --connect-timeout 5 \
        --max-time 10 \
        --retry 5 \
        --retry-connrefused \
        --retry-delay 0 \
        --retry-max-time 60 \
        --silent \
        --fail \
        "${QUORUM_PTM}:9000/upcheck"
    echo ""

    ADDITIONAL_ARGS="${ADDITIONAL_ARGS:-} --ptm.timeout 5 --ptm.url http://${QUORUM_PTM}:9101 --ptm.http.writebuffersize 4096 --ptm.http.readbuffersize 4096 --ptm.tls.mode off"
fi

touch /var/log/quorum/geth-$(hostname -i).log
chmod 777 /var/log/quorum/geth-$(hostname -i).log

cat /proc/1/fd/2 /proc/1/fd/1 > /var/log/quorum/geth-$(hostname -i).log &

exec geth \
--datadir /data \
--nodiscover \
--permissioned \
--verbosity $VERBOSITY \
$CONSENSUS_ARGS \
--syncmode full \
--metrics --pprof --pprof.addr 0.0.0.0 --pprof.port 9545 \
--networkid ${QUORUM_NETWORK_ID:-1337} \
--http --http.addr 0.0.0.0 --http.port 8545 --http.corsdomain "*" --http.vhosts "*" --http.api admin,eth,debug,miner,net,txpool,personal,web3,quorumExtension,$QUORUM_API \
--ws --ws.addr 0.0.0.0 --ws.port 8546 --ws.origins "*" --ws.api admin,eth,debug,miner,net,txpool,personal,web3,quorumExtension,$QUORUM_API \
--port 30303 \
--identity ${HOSTNAME}-${GOQUORUM_CONS_ALGO} \
--unlock ${ADDRESS} \
--allow-insecure-unlock \
--password /data/passwords.txt \
${ADDITIONAL_ARGS:-} \
2>&1