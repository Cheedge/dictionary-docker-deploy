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
COPY ./requirements.txt /project
COPY uwsgi.ini /project
COPY app.py /project
COPY ./templates/ /project/templates
COPY ./static/css /project/static/css
COPY ./static/js /project/static/js
#RUN ls /project/templates
#RUN ls /project/static
RUN pip install -r requirements.txt
CMD ["uwsgi", "--ini", "uwsgi.ini"]
