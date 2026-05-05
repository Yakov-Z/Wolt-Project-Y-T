# Product Recommender System

This project is a CLI-based product recommendation system written in C++. It is fully containerized using Docker, ensuring consistent execution across different environments. We use `docker-compose` to seamlessly mount the local `data` directory to the container, ensuring that all user data (added via the `add` command) persists between runs.

## Prerequisites

* **Docker and Docker Compose** installed on your machine.
* Ensure there is a folder named `data` in the root directory of the project (alongside this `README.md` file). 

## Getting Started

Follow these steps to build, run, and test the application using Docker Compose.

### 1. Build the Project

To compile the C++ code and build the Docker image, run the following command in the root directory:

```bash
docker-compose build
```
### 2. Run the Application

To start the Interactive Command Line Interface (CLI), run:

```bash
docker-compose run --rm app
```

> **Note:** The `--rm` flag ensures the container is automatically cleaned up after you exit the application. Any data you enter (e.g., via the `add` command) will be safely saved to `data/users_data.txt` on your local machine and will be loaded automatically on the next run.

### 3. Run the Unit Tests

To execute the Google Test (gtest) suite and verify the system's logic, run:

```bash
docker-compose run --rm app ./build/runTests
```

*(If your test executable has a different name, replace `./build/runTests` with the correct path, e.g., `./build/RecommenderTests`).*

## Commands

Once the application is running, you can use the following commands:

* `add [userid] [productid1] [productid2] ...`
  Associates a list of products with a specific user. This data is saved automatically.

* `recommend [userid] [productid]`
  Provides up to 10 product recommendations based on other users with similar tastes who also watched the specified product.

* `help`
  Displays the list of available commands.