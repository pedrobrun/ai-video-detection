# Using a Node.js base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and install dependencies
COPY package.json package-lock.json* ./
RUN yarn install

# Copy the rest of your frontend application
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to run your app
CMD ["yarn", "dev"]
