#!/bin/bash
# rm all log files of mysql, redis

rm -rf ./master/datalog/*
rm -rf ./slave/datalog/*
rm -rf ../flask/project/uwsgi.log
rm -rf ../redis/myredis/redis_6379.log

# stop running containers
docker ps | grep "_v1" | awk '{print $1}' | xargs docker stop
# kill version v1 containers
docker ps -a | grep "_v1" | awk '{print $1}' | xargs docker rm
# remove images used in compose
docker images | grep compose | awk '{print $3}' | xargs docker rmi