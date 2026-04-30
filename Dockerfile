# Use an official Ubuntu as a parent image
FROM ubuntu:22.04

# Install dependencies  
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . .

# Build the project
RUN cmake -B build
RUN cmake --build build

# Run the app as deafault command when the container starts
CMD ["./build/RecommenderApp"]