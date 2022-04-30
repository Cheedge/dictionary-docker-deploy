FROM python:3.8
MAINTAINER cheedge
RUN mkdir /project
RUN mkdir /project/templates
RUN mkdir -p /project/static/css
RUN mkdir -p /project/static/js
EXPOSE 5000
WORKDIR /project
ENV FLASK_APP=app
ENV FLASK_ENV=development
COPY ./project/requirements.txt /project
COPY ./project/uwsgi.ini /project
COPY ./project/app.py /project
COPY ./project/templates/ /project/templates
COPY ./project/static/css /project/static/css
COPY ./project/static/js /project/static/js
#RUN ls /project/templates
#RUN ls /project/static
RUN pip install -r requirements.txt
CMD ["uwsgi", "--ini", "uwsgi.ini"]
