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

popd
