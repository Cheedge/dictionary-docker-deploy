#!/bin/bash
SLAVE_IP=`hostname -I`
# MASTER_IP=`getent hosts ${MASTER_CONTAINER} | awk '{print $1}'`
MASTER_IP="172.21.0.2"
LOG_FILE=`mysql -h ${MASTER_IP} -uroot --port 3306 -pMysql_666 -AN --execute "show master status;" | awk '{print $1}'`
LOG_POS=`mysql -h ${MASTER_IP} -uroot --port 3306 -pMysql_666 -AN --execute "show master status;" | awk '{print $2}'`


mysql -h ${SLAVE_IP} -uroot -pMysql_666 -AN --execute "CHANGE REPLICATION SOURCE TO SOURCE_HOST='${MASTER_IP}', SOURCE_PORT=3306, SOURCE_USER='slave', SOURCE_PASSWORD='Mysql_666', SOURCE_LOG_FILE='${LOG_FILE}', SOURCE_LOG_POS='${LOG_POS}';"

# mysql -uroot -pMysql_666 -AN --execute "show slave status;" | grep ""