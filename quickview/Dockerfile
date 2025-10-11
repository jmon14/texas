# Use the latest LTS version of Node.js
FROM node:18-alpine
 
# Set the working directory inside the container
WORKDIR /app

# Accept build arguments for environment variables
ARG REACT_APP_ULTRON_API_URL

# Set environment variables for build time
ENV REACT_APP_ULTRON_API_URL=$REACT_APP_ULTRON_API_URL
 
# Copy package.json and package-lock.json
COPY package*.json ./
 
# Install dependencies with legacy peer deps to resolve version conflicts
RUN npm install --legacy-peer-deps
 
# Copy the rest of your application files
COPY . .
 
# Build the production version
RUN npm run build

# Install a simple HTTP server to serve static files
RUN npm install -g serve
 
# Expose the port your app runs on
EXPOSE 8080
 
# Serve the built static files
CMD ["serve", "-s", "dist", "-l", "8080"]