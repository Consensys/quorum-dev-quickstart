#!/usr/bin/env bash

. ./network/.env

pushd ./network

if [ $1 == "up" ]; then
  if [ -f "$LOCK_FILE" ]; then
    . resume.sh
  else
    . run.sh
  fi
elif [ $1 == "down" ]; then
. stop.sh
rm $LOCK_FILE
fi

echo "Waiting for network to be up "
until $(curl -H "Content-Type: application/json" -X POST --output /dev/null --silent --fail --data '{"jsonrpc":"2.0","method":"eth_gasPrice","params":[],"id":1}' http://localhost:8545); do
  printf '.'
  sleep 1
done

popd
