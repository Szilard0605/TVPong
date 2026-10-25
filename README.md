# TVPong

TVPong is a Pong game that lets you use your phones as controllers while displaying the game on a TV or another screen.

The server receives input from the controllers and forwards it to the host, which handles the game simulation and renders the game.

The project was primarily an experiment in building a multiplayer game with separate controllers and a host display. The goal was to play Pong on a TV, hence the name **TVPong**.

## Disclaimer

This project was a learning exercise. I don't intend to actively maintain or update it.

## Setup and Usage

### Prerequisites

- [Node.js](https://nodejs.org/) to run the server.
- Python (optional) to serve the controller and host files over HTTP.

### 1. Start the Server

The server is built with Node.js.

Navigate to the `server` directory and start it:

```bash
cd server
node index.js
```

### 2. Serve the Controller and Host

The controller and host are client-side applications that can be served by any HTTP server. I used Python's built-in HTTP server during development.

For example, to serve the files from a directory:

```bash
python -m http.server 8000
```

Open the corresponding URL in your browser to access the application.

*Note: The exact URLs and any additional configuration depend on your project setup.*
