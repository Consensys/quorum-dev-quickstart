#!/bin/bash

cp permission-config.json ../../config/permissions/ 
cd ../../ 
./stop.sh
echo "Waiting 30s for containers to stop"
sleep 30
./resume.sh
