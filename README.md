# Exercise-1
## How to Build and Run using Docker
1. Build the Docker image (Run once):
Open your terminal in the project's root directory and run:
```docker build -t recommender-system .```

2. Run the Main Application (The Exercise):
To run the CLI application interactively, use the following command:
```docker run -it --rm recommender-system```

> (Note: If the default CMD is overridden, you can also run it explicitly with: docker run -it --rm recommender-system ./build/RecommenderApp)

3. Run the Unit Tests (Separately):
To run the GTest test suite and verify the system's logic, use:
```docker run --rm recommender-system ./build/runTests```
