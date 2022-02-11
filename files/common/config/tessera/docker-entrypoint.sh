#!/bin/sh

mkdir -p /var/log/tessera/;
mkdir -p /data/tm/;

envsubst < /data/tessera-config-template.json > /data/tessera-config.json

cat /data/tessera-config.json

touch /var/log/tessera/tessera-$(hostname -i).log
chmod 777 /var/log/tessera/tessera-$(hostname -i).log

exec /tessera/bin/tessera \
    -configfile /data/tessera-config.json

