# Base stage
FROM node:18.13.0 AS base

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN yarn

# Copy the rest of the application code to the working directory
COPY . .

# Build stage for production
FROM base AS production

# Set environment variables for production
ENV NODE_ENV=production

# Build the NestJS application
RUN yarn build

# Expose the port the app runs on
EXPOSE 3001

# Start the NestJS application
CMD [ "node", "dist/main.js" ]

# Build stage for staging
FROM base AS staging

# Set environment variables for staging
ENV NODE_ENV=staging

ENV NODE_ENV=development

# Install development dependencies
RUN yarn install --frozen-lockfile

# Expose the port the app runs on
EXPOSE 3001

# Start the NestJS application in development mode
CMD [ "yarn", "start:dev" ]