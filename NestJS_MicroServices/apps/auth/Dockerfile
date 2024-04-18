# Use the official Node.js LTS image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./
RUN ls 
# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

#Solve the problem reinstaling bcrypt
#RUN npm uninstall bcrypt
#RUN npm i bcrypt

# Build the Nest.js application
RUN npm run build

#RUN npm run start:dev auth
# Expose the port that your Nest.js application will run on
#EXPOSE 3000

# Command to run your application
#CMD [ "npm", "uninstall", "bcrypt" ]
#CMD [ "npm", "install", "bcrypt" ]
#CMD ["npm", "start"]


#This means that as long as the package.json and package-lock.json files don't change, Docker can reuse the previously cached layer where dependencies were installed.
#This saves time during subsequent builds because Docker doesn't need to reinstall dependencies if the package files haven't changed.
#The COPY . . command copies all the files and directories from the context directory, including the package*.json files.
#However, by doing the COPY package*.json ./ first, you optimize the Docker build process by taking advantage of caching