# Use the official Node.js LTS image as the base image
FROM node:20

RUN apt-get update && apt-get install -y default-mysql-client

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./
RUN ls 
# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Nest.js application
RUN npm run build

COPY apps/auth/checkMYSQLRediness.sh /checkMYSQLRediness.sh
RUN ls 
RUN pwd
RUN chmod +x /checkMYSQLRediness.sh
RUN cat /checkMYSQLRediness.sh

#A Dockerfile RUN command only runs once when the image is built; the entrypoint script runs every time you start the container. 
ENTRYPOINT ["/bin/sh","/checkMYSQLRediness.sh"]

