#pragma once

// Bootstrapper class responsible for assembling and starting the server system.
class ServerRunner {
public:
    // Initializes dependencies, sets up the server environment, and starts the main loop.
    int run(int port);
};