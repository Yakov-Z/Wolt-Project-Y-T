#pragma once

// Interface for socket servers
class ISocketServer {
public:
    // Run the server
    virtual void runServer() = 0;
    // Virtual destructor to ensure proper cleanup of derived classes.
    virtual ~ISocketServer() = default;
};