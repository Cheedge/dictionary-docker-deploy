FROM mysql
COPY ./Dictionary.sql /docker-entrypoint-initdb.d/
# COPY ./master.sh /docker-entrypoint-initdb.d/
RUN chown mysql:mysql /var/lib/mysql
RUN chmod 777 /var/lib/mysql
RUN ls -l /var/lib/mysql
