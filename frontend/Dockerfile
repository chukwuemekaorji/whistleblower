# Use Node.js 20 (stable and common for Vite)
FROM node:20-alpine

WORKDIR /app

# Copy package files first for faster building
COPY package*.json ./

RUN npm install

# Copy the rest of your frontend code
COPY . .

# Expose the port Vite usually runs on
EXPOSE 5173

# Run the Vite dev server and allow external access
# Adding -- --host to ensure it listens on all interfaces
CMD ["npm", "run", "dev", "--", "--host"]