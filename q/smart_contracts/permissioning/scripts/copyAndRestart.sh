#!/bin/bash

echo "Copying permission-config.json file to the volume"
cp permission-config.json ../../config/permissions/ 
cd ../../ 
echo "Restarting network stop"
./restart.sh
