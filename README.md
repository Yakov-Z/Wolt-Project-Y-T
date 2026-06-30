# Chikobyte - Food Delivery Platform

Welcome to the final submission of the Food Delivery Platform project. This application simulates a real-world food delivery service (inspired by platforms like Wolt), featuring a complete frontend, a robust backend, and an intelligent C++ recommender system.

## Repository Structure & Submissions
Please note that the submissions for all exercises in this course are organized into dedicated branches. 
You can find the specific states of the project for each exercise in the following branches:
* `Ex1-submission`
* `Ex2-submission`
* `Ex3-submission`
* `Ex4-submission` 
* `Ex5-submission` (Current Final Submission)

## Project Architecture
The project is built using a modern, containerized microservices architecture:
* **Frontend (chikobyte-app):** A dynamic, responsive React Native mobile application. It uses Context API for global state management, Expo Router for navigation, and supports dynamic theming (Dark/Light mode).
* **Web Server (web_server):** A Node.js/Express RESTful API that handles user authentication (JWT), business logic, and database interactions. 
* **Database (mongodb):** A MongoDB database, completely replacing in-memory arrays for robust, persistent data storage using Mongoose.
* **Core Backend (server_app):** A high-performance C++ application handling heavy computations and real-time TCP socket communications.
* **Containerization:** The entire backend infrastructure is containerized using Docker and Docker Compose for seamless environment setup.

## Complete Documentation (The Wiki)
As per the project requirements, we have created a comprehensive, step-by-step guide detailing how to build, run, and interact with the entire Chikobyte ecosystem. 

Please navigate to our `wiki` folder (or the GitHub Wiki tab) for detailed instructions accompanied by screenshots for every major flow:
1. **Environment Setup & Execution:** Complete guide to compiling the C++ code, running Docker-Compose, configuring the network, and starting the Expo mobile app.
2. **Authentication:** User Registration (with image upload logic and validations) and Login.
3. **Restaurant Management:** Creating, updating, and deleting restaurants.
4. **Menu & Products:** Managing a restaurant's menu items.
5. **Orders & Cart:** The checkout process, submitting orders, updating existing orders, and managing order history.