#!/usr/bin/env bash

pushd ./network

if [ $1 == "up" ]; then
. run.sh
elif [ $1 == "down" ]; then
rm -f ./network/.quorumDevQuickstart.lock
. stop.sh
fi

popd
