# Using a Node.js base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and install dependencies
COPY package.json yarn.lock ./

# Copy the rest of your frontend application
COPY . .

# Expose the port your app runs on
EXPOSE 3000