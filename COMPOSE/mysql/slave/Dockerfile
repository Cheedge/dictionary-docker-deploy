FROM mysql
USER root
COPY ./slave.sql /docker-entrypoint-initdb.d/
# COPY ./slave.sh /docker-entrypoint-initdb.d/
# RUN chmod 775 /docker-entrypoint-initdb.d/slave.sh
# COPY ./slave.sh /slave.sh
# RUN chmod 775 /slave.sh
# RUN /slave.sh
RUN chmod 777 /var/lib/mysql