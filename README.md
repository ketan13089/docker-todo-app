# ToDo Master

This is a simple to-do web application built with Node.js, Express, and React.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Docker and Docker Compose (for containerized deployment)

## Project Structure

- `server/`: Contains the backend Node.js and Express application
  - `server.js`: Main server file
  - `Dockerfile`: Backend container configuration
- `client/`: Contains the frontend React application
  - `src/`: Source code for the React application
  - `public/`: Static assets
  - `Dockerfile`: Frontend container configuration
- `docker-compose.yml`: Docker compose configuration for the entire stack
- `deploy.sh`: Deployment script

## Local Development

### Backend (Server)

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   The server will be running on `http://localhost:5000`.

### Frontend (Client)

1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the React application:
   ```bash
   npm start
   ```
   The application will open in your browser at `http://localhost:3000`.

## Docker Deployment

To run the entire application using Docker:

```bash
# Build and start the containers
docker-compose up --build

# To run in detached mode
docker-compose up -d --build

# To stop the containers
docker-compose down
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## Features

- Add new to-do items
- Mark to-do items as complete
- Delete to-do items
- In-memory database (data will be lost on server restart)
- Responsive design
- Docker support for easy deployment
- Styling inspired by docker.com

## API Documentation

### Endpoints

- `GET /api/todos`: Get all todo items
- `POST /api/todos`: Create a new todo item
  - Body: `{ "title": "Todo title" }`
- `PUT /api/todos/:id`: Update a todo item
  - Body: `{ "completed": true }`
- `DELETE /api/todos/:id`: Delete a todo item

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -m 'Add some feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## Known Issues

- Data persistence is not implemented (uses in-memory storage)
- No authentication system in place
- No input validation on the server side

