FROM nginx
MAINTAINER cheedgelee@gmail.com
RUN mkdir /project
RUN mkdir /project/templates
RUN mkdir -p /project/static/css
RUN mkdir -p /project/static/js
EXPOSE 8080
WORKDIR /project
COPY ./templates/ /project/templates
COPY ./static/css /project/static/css
COPY ./static/js /project/static/js
COPY ./conf/nginx.conf /project/nginx.conf
CMD ["nginx", "-c", "/project/nginx.conf"]
