#node.js runtime
FROM node:18-alpine

#working directory
WORKDIR /app

#copy of package.json
COPY package*.json ./

#installing dependencies
RUN npm install

#copy rest of files
COPY . .

#expose the port
EXPOSE 5000

#run server when container launched
CMD ["npm", "start"]

