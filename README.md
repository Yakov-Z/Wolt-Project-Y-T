# Product Recommender System - Client-Server Architecture

This project is a product recommendation system utilizing a Client-Server architecture over TCP. The server, implemented in C++, handles all business logic, data persistence, and calculations. The client, implemented in Python 3, acts as an interactive CLI, forwarding user commands to the server and displaying the responses. 

The system is fully containerized using Docker, ensuring consistent execution across different environments. We use `docker-compose` to seamlessly orchestrate the server, client, and testing environments, while ensuring that all user data persists between runs.

## Architecture and SOLID Principles

This project was built with a strong emphasis on clean code, loose coupling, and SOLID principles to allow for easy future extensions.

### Handling New Requirements
The transition from a monolithic console app to a client-server architecture demonstrated the flexibility of our initial design:

* **Command Renaming & New Commands:** The fact that commands were renamed (e.g., `add` to `POST`, `recommend` to `GET`) and new commands were added (`PATCH`, `DELETE`) required **zero** changes to the existing logic of the `Command` classes themselves. Because we used the **Command Pattern**, each command is encapsulated in its own class. The `InputParser` maps string inputs to command creators dynamically. Adding or changing a command only required mapping a new string to a new command object in the `ServerRunner`, adhering perfectly to the **Open/Closed Principle (OCP)**.
* **Response Output Changes:** Changing the output format of the commands was handled gracefully by utilizing an `IOutputWriter` interface. The core logic of the commands remained untouched; they simply output different strings to the writer interface provided to them.
* **Switching from Console to Sockets:** The transition from standard console I/O to TCP sockets did not require touching the core system logic. By using interfaces (`IInputReader` and `IOutputWriter`), we simply created new implementations (`SocketInputReader` and `SocketOutputWriter`) and injected them into the system. The commands and parser are completely unaware of whether they are reading from a keyboard or a network socket.
* **Future Multi-Client Support:** Currently, the server handles one client at a time. However, if required to support concurrent clients in the future, the system is prepared. The architecture allows for wrapping the shared resources (like the data repository) with a thread-safe Decorator pattern, without altering the existing business logic, keeping the system open for expansion.

## Prerequisites

* **Docker and Docker Compose** installed on your machine.
* Ensure there is a folder named `data` in the root directory of the project (alongside this `README.md` file) to allow data persistence.

## Getting Started

Follow these steps to build, run, and test the application using Docker Compose.

### 1. Build and Run the System

To automatically build both the C++ server and Python client images and start the system, run the following command in the root directory:

```bash
docker-compose up --build
```
> **Note:** By default, the system is configured to run on port `777`. The port argument is passed to the server's `main` function and the client's `main` via the `docker-compose.yml` file. If you wish to test the system with a different port, please change the port number in the `command` field for both the `server_app` and `client_app` services inside `docker-compose.yml` before running.

Once the system is up, you must interact with the client in a separate terminal.

### 2. Interact with the Client

Because `docker-compose up` runs the containers in the background, you need to attach a terminal to the Python client to interact with it. In a **new terminal window**, run:

```bash
docker-compose run client_app
```
This will open an interactive prompt where you can start typing commands. The client maintains a single, continuous TCP connection to the server.

### 3. Run the Unit Tests

The C++ server unit tests (developed using TDD) run in complete isolation from the main server/client applications. To execute the Google Test suite, run:

```bash
docker-compose run Tests
```
### 4. Stopping the System

When you are finished, stop and remove the background containers by running:

```bash
docker-compose down
```

## Available Commands

Once the client is running, you can use the following commands. Note that all commands are sent exactly as typed to the server.

* `DELETE [userid] [productid1] [productid2] ...`
    Deletes the association of the specified products from the user.
* `GET [userid] [productid]`
    Provides up to 10 product recommendations based on other users with similar tastes who also watched the specified product.
* `PATCH [userid] [productid1] [productid2] ...`
    Adds products to an **existing** user.
* `POST [userid] [productid1] [productid2] ...`
    Creates a **new** user and associates the provided products with them.
* `help`
    Displays the list of available commands and their expected arguments in alphabetical order.