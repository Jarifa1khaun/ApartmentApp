#!/bin/bash

apt-get update && apt-get install net-tools;
ip=`ifconfig eth0 | grep 'inet ' | awk '{print $2;}'`;
sed -i -e "s|SERVER_IP|${ip}|g" './FrontEnd/site/js/configure_url.js';
docker-compose -f master.yaml build && docker-compose -f master.yaml up