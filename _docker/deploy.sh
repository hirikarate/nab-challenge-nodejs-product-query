#!/bin/bash

source ./constants.sh .

docker network create -d overlay --attachable 'nab-net'

echo "[--- Creating swarm services in stack '$stackname' ---]"
docker stack deploy -c docker-compose.yml $stackname

echo "[--- NEARLY DONE! Please wait ---]"
sleep 5
echo "[--- Stablizing services ---]"
sleep 5
echo "[--- DONE! ---]"
docker service ls
