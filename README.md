# To-Do Web App

This is a simple to-do web application built with Node.js, Express, and React.

## Project Structure

- `server/`: Contains the backend Node.js and Express application.
- `client/`: Contains the frontend React application.

## How to Run

### Backend (Server)

1.  Navigate to the `server` directory:
    ```bash
    cd server
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Start the server:
    ```bash
    npm start
    ```
    The server will be running on `http://localhost:5000`.

### Frontend (Client)

1.  Open a new terminal and navigate to the `client` directory:
    ```bash
    cd client
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Start the React application:
    ```bash
    npm start
    ```
    The application will open in your browser at `http://localhost:3000`.

## Features

- Add new to-do items.
- Mark to-do items as complete.
- Delete to-do items.
- In-memory database (data will be lost on server restart).
- Styling inspired by docker.com. 