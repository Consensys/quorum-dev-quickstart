#!/bin/bash -eu

# Copyright 2018 ConsenSys AG.
#
# Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
# the License. You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
# an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
# specific language governing permissions and limitations under the License.

NO_LOCK_REQUIRED=false

. ./.env
. ./.common.sh
dots=""
maxRetryCount=50
HOST=${DOCKER_PORT_2375_TCP_ADDR:-"localhost"}

# Displays links to exposed services
echo "${bold}*************************************"
echo "Quorum Dev Quickstart "
echo "*************************************${normal}"

elk_setup=true
if [ -z `docker-compose -f docker-compose.yml ps -q kibana 2>/dev/null` ] ; then
  elk_setup=false
fi
if [ $elk_setup == true ]; then
    while [ "$(curl -m 10 -s -o /dev/null -w ''%{http_code}'' http://${HOST}:5601/api/status)" != "200" ] && [ ${#dots} -le ${maxRetryCount} ]
    do
      dots=$dots"."
      printf "Kibana is starting, please wait $dots\\r"
      sleep 10
    done

    echo "Setting up the index patterns in kibana ..."
    curl --silent --output /dev/null -X POST "http://${HOST}:5601/api/saved_objects/index-pattern/metricbeat" -H 'kbn-xsrf: true' -H 'Content-Type: application/json' -d '{"attributes": {"title": "metricbeat-*","timeFieldName": "@timestamp"}}'
    curl --silent --output /dev/null -X POST "http://${HOST}:5601/api/saved_objects/_import" -H 'kbn-xsrf: true' --form file=@./config/kibana/besu_overview_dashboard.ndjson
    curl --silent --output /dev/null -X POST "http://${HOST}:5601/api/saved_objects/index-pattern/besu" -H 'kbn-xsrf: true' -H 'Content-Type: application/json' -d '{"attributes": {"title": "besu-*","timeFieldName": "@timestamp"}}'
    curl --silent --output /dev/null -X POST "http://${HOST}:5601/api/saved_objects/index-pattern/orion" -H 'kbn-xsrf: true' -H 'Content-Type: application/json' -d '{"attributes": {"title": "orion-*","timeFieldName": "@timestamp"}}'
    curl --silent --output /dev/null -X POST "http://${HOST}:5601/api/saved_objects/index-pattern/quorum" -H 'kbn-xsrf: true' -H 'Content-Type: application/json' -d '{"attributes": {"title": "quorum-*","timeFieldName": "@timestamp"}}'
    curl --silent --output /dev/null -X POST "http://${HOST}:5601/api/saved_objects/index-pattern/tessera" -H 'kbn-xsrf: true' -H 'Content-Type: application/json' -d '{"attributes": {"title": "tessera-*","timeFieldName": "@timestamp"}}'

fi

echo "----------------------------------"
echo "List endpoints and services"
echo "----------------------------------"

echo "JSON-RPC HTTP service endpoint      : http://${HOST}:8545"
echo "JSON-RPC WebSocket service endpoint : ws://${HOST}:8546"
echo "Web block explorer address          : http://${HOST}:25000/"
if [ ! -z `docker-compose -f docker-compose.yml ps -q prometheus 2> /dev/null` ]; then
echo "Prometheus address                  : http://${HOST}:9090/graph"
echo "Grafana address                     : http://${HOST}:3000/d/XE4V0WGZz/besu-overview?orgId=1&refresh=10s&from=now-30m&to=now&var-system=All"
fi
if [ ! -z `docker-compose -f docker-compose.yml ps -q cakeshop 2> /dev/null` ]; then
echo "Cakeshop toolkit address            : http://${HOST}:8999"
fi
if [ $elk_setup == true ]; then
echo "Collated logs using Kibana endpoint : http://${HOST}:5601/app/kibana#/discover"
fi
echo ""
echo "For more information on the endpoints and services, refer to README.md in the installation directory."
echo "****************************************************************"
