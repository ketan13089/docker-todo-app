#!/bin/bash

#Update system
sudo yum update -y

#Install Docker and Git
sudo yum install -y docker git

#Start Docker service
sudo service docker start

#Install Docker Compose
sudo curl -SL https://github.com/docker/compose/releases/download/v2.24.2/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

#Add ec2-user to Docker group
sudo usermod -aG docker ec2-user

#Clone your repository
git clone https://github.com/ketan13089/docker-todo-app.git
cd docker-todo-app

#Start app using Docker Compose
docker-compose up --build
