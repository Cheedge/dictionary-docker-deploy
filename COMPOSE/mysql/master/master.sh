#!/bin/bash
MASTER_IP=`hostname -I`

mysql -h ${MASTER_IP} -uroot -pMysql_666 -AN -e  "CREATE USER 'slave'@'%' IDENTIFIED BY 'Mysql_666';"
mysql -h ${MASTER_IP} -uroot -pMysql_666 -AN -e "GRANT REPLICATION SLAVE ON *.* TO 'slave'@'%';"
mysql -h ${MASTER_IP} -uroot -pMysql_666 -AN -e "FLUSH PRIVILEGES;"
# CREATE USER 'slave'@'%' IDENTIFIED BY 'Mysql_666';
# GRANT REPLICATION SLAVE ON *.* TO 'slave'@'%';
# FLUSH PRIVILEGES;