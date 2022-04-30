#!/bin/bash

rm -rf ./master/datalog/*
rm -rf ./slave/datalog/*
rm -rf ../flask/project/uwsgi.log
rm -rf ../redis/myredis/redis_6379.log

docker ps | grep "_v1" | awk '{print $1}' | xargs docker stop

docker ps -a | grep "_v1" | awk '{print $1}' | xargs docker rm

docker images | grep compose | awk '{print $3}' | xargs docker rmi