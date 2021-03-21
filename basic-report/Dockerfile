FROM ubuntu:18.04

RUN apt-get update && apt-get install -y curl gnupg2 nodejs npm openjdk-11-jdk-headless python

RUN mkdir /src
WORKDIR /src

CMD ["bash", "-c", "npm i && npm run compile"]
