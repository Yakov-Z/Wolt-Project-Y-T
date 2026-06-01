# Food Delivery Web API & Recommender System - Client-Server Architecture

This project implements a comprehensive food delivery web service and product recommendation system utilizing a dual-server architecture. 

The system consists of two main components:
1. **Web Server (Node.js/Express):** Acts as the RESTful API gateway, managing users, restaurants, products, and orders using an MVC architecture.
2. **Recommender Backend (C++):** A TCP server that handles heavy business logic, calculations, and maintains the recommendation algorithms.

The system is fully containerized using Docker, ensuring consistent execution across different environments. We use `docker-compose` to seamlessly orchestrate the web server, C++ backend, and testing environments, while ensuring that all user data persists between runs.

## Submission Branches

Please note that the submissions for the exercises are located in separate branches:
* **Exercise 1:** `Ex1-submission`
* **Exercise 2:** `Ex2-submission`
* **Exercise 3 (Current):** `EX3-SUBMISSION`

## Architecture and SOLID Principles

This project was built with a strong emphasis on clean code, loose coupling, and SOLID principles to allow for easy future extensions. 

* **MVC Architecture:** The Node.js server strictly separates Routes, Controllers, and Models.
* **TCP Integration:** The Node.js web server communicates seamlessly with the C++ backend via TCP sockets to update user views and retrieve recommendations.
* **Command Pattern (Backend):** The C++ server encapsulates commands (POST, GET, PATCH, DELETE) in their own classes. Adding or modifying commands requires zero changes to the core logic, adhering to the Open/Closed Principle (OCP).

## Prerequisites

* **Docker and Docker Compose** installed on your machine.
* Ensure there is a folder named `data` in the root directory of the project to allow data persistence.

## Getting Started

Follow these steps to build, run, and test the application using Docker Compose.

### 1. Build and Run the System

To compile the C++ code, build the Node.js environment, and start both servers, run the following command in the root directory:

```bash
docker-compose up --build

> **Note:** The Web Server will be exposed on port `3000` of your host machine. Internally, it communicates with the C++ server on port `8080`.

### 2. Run the Unit Tests

The C++ server unit tests (developed using TDD) run in complete isolation. To execute the Google Test suite, run:

```bash
docker-compose run tests
```

### 3. Stopping the System

When you are finished, stop the background servers and clean up the network by running:

```bash
docker-compose down
```
## REST API Examples (Node.js Web Server)

The following are comprehensive examples of how to interact with all the Node.js REST API endpoints using `curl`. 

### 1. Users & Authentication

* **Create a new user (POST):**
  ```bash
  curl -i -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{"username": "admin", "password": "123", "address": "Tel Aviv"}'
  ```
* **Get user details (GET):**
  ```bash
  curl -i http://localhost:3000/api/users/1
  ```
* **Login / Generate Token (POST):**
  ```bash
  curl -i -X POST http://localhost:3000/api/tokens -H "Content-Type: application/json" -d '{"username": "admin", "password": "123"}'
  ```

### 2. Restaurants

* **Get all restaurants (GET):**
  ```bash
  curl -i http://localhost:3000/api/restaurants
  ```
* **Create a new restaurant (POST):**
  ```bash
  curl -i -X POST http://localhost:3000/api/restaurants -H "Content-Type: application/json" -d '{"name": "Pizza Planet", "address": "Ramat Gan"}'
  ```
* **Get restaurant details (GET):**
  ```bash
  curl -i http://localhost:3000/api/restaurants/1
  ```
* **Update a restaurant (PATCH):**
  ```bash
  curl -i -X PATCH http://localhost:3000/api/restaurants/1 -H "Content-Type: application/json" -d '{"name": "Pizza Planet Plus"}'
  ```
* **Delete a restaurant (DELETE):**
  ```bash
  curl -i -X DELETE http://localhost:3000/api/restaurants/1
  ```

### 3. Products (Menu)

* **Get a restaurant's menu (GET):**
  ```bash
  curl -i http://localhost:3000/api/restaurants/1/products
  ```
* **Add a product to the menu (POST):**
  ```bash
  curl -i -X POST http://localhost:3000/api/restaurants/1/products -H "Content-Type: application/json" -d '{"name": "Margarita Pizza", "price": 50}'
  ```
* **Get product details (GET):** *(Triggers backend recommendation update if userid is provided)*
  ```bash
  curl -i http://localhost:3000/api/restaurants/1/products/1 -H "userid: 1"
  ```
* **Update a product (PATCH):**
  ```bash
  curl -i -X PATCH http://localhost:3000/api/restaurants/1/products/1 -H "Content-Type: application/json" -d '{"price": 55}'
  ```
* **Delete a product (DELETE):**
  ```bash
  curl -i -X DELETE http://localhost:3000/api/restaurants/1/products/1
  ```

### 4. Orders

*Note: All order endpoints require the `userid` header to identify the logged-in user.*

* **Create a new order (POST):**
  ```bash
  curl -i -X POST http://localhost:3000/api/orders -H "Content-Type: application/json" -H "userid: 1" -d '{"restaurant": {"id": 1}, "products": [{"id": 1, "price": 50}]}'
  ```
* **Get all user's orders (GET):**
  ```bash
  curl -i http://localhost:3000/api/orders -H "userid: 1"
  ```
* **Get specific order details (GET):**
  ```bash
  curl -i http://localhost:3000/api/orders/1 -H "userid: 1"
  ```
* **Update an order (PATCH):**
  ```bash
  curl -i -X PATCH http://localhost:3000/api/orders/1 -H "Content-Type: application/json" -H "userid: 1" -d '{"products": [{"id": 1, "price": 50}, {"id": 2, "price": 15}]}'
  ```
* **Delete an order (DELETE):**
  ```bash
  curl -i -X DELETE http://localhost:3000/api/orders/1 -H "userid: 1"
  ```

### 5. Search

* **Search for restaurants and products (GET):**
  ```bash
  curl -i http://localhost:3000/api/search/pizza
  ```
## Internal Backend Commands (C++ TCP Server)

Behind the scenes, the Node.js server sends the following formatted commands to the C++ TCP server. If you connect to the backend directly via a TCP client, you can use these commands:

* **POST**
  * **Usage:** `POST [userid] [productid1] [productid2] ...`
  * **Example:** `POST 1 -1` (Registers user 1 without any initial products).
  * **Description:** Creates a new user and associates the provided products with them.

* **PATCH**
  * **Usage:** `PATCH [userid] [productid1] [productid2] ...`
  * **Example:** `PATCH 1 15 22`
  * **Description:** Adds products (views/purchases) to an existing user.

* **GET**
  * **Usage:** `GET [userid] [productid]`
  * **Example:** `GET 1 15`
  * **Description:** Provides up to 10 product recommendations based on other users with similar tastes who also interacted with the specified product.

* **DELETE**
  * **Usage:** `DELETE [userid] [productid1] [productid2] ...`
  * **Example:** `DELETE 1 15`
  * **Description:** Deletes the association of the specified products from the user.

* **help**
  * **Usage:** `help`
  * **Description:** Displays the list of available commands and their expected arguments in alphabetical order.