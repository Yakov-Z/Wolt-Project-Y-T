#include "ServerRunner.h"
#include <filesystem>
#include <iostream>


int main(int argc, char* argv[]) {
    if(argc != 2) {
        std::cerr << "Usage: " << argv[0] << " <port>" << std::endl;
        return 1;
    }

    int port;
    try {
        port = std::stoi(argv[1]);
    } catch (const std::exception& e) {
        std::cerr << "Error: Invalid port number provided." << std::endl;
        return 1;
    }

    ServerRunner runner;
    return runner.run(port);
}