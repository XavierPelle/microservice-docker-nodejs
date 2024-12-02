FROM python:3.11-slim-buster

WORKDIR /usr/src/app

COPY . .

RUN pip install -r requirements.txt

EXPOSE 5004

ENTRYPOINT ["tail", "-f", "/dev/null"]