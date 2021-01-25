#!/usr/bin/env bash

pushd ./network

if [ $1 == "up" ]; then
. run.sh
elif [ $1 == "down" ]; then
. stop.sh
rm -f ./network/.quorumDevQuickstart.lock
fi

popd
