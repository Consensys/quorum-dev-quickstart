#!/usr/bin/env bash

pushd ./network

if [ $1 == "up" ]; then
  if [ -f "./quorumDevQuickstart.lock" ]; then
    . resume.sh
  else
    . run.sh
  fi
elif [ $1 == "down" ]; then
. stop.sh
fi

popd
