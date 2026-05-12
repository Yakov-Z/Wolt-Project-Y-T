#include "ServerRunner.h"
#include <filesystem>
#include <iostream>

int main(int argc, char* argv[]) {
    // Validate command-line arguments to ensure exactly one port parameter is provided
    if(argc != 2) {
        std::cerr << "Usage: " << argv[0] << " <port>" << std::endl;
        return 1;
    }

    int port;
    // Safely parse the provided port string into an integer
    try {
        port = std::stoi(argv[1]);
    } catch (const std::exception& e) {
        std::cerr << "Error: Invalid port number provided." << std::endl;
        return 1;
    }

    // Instantiate the application bootstrapper and launch the server
    ServerRunner runner;
    return runner.run(port);
}