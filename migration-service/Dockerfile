# Use an official Node.js runtime as a base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose port 8080 to allow outside access
# EXPOSE 3001

# Set environment variable NODE_ENV to 'production'
# ENV NODE_ENV=production

# Command to run the application
# CMD ["npm","run", "migration:run"]
CMD ["npm","start"]