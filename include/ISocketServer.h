#pragma once

// Interface for socket servers
class ISocketServer {
public:
    // Run the server
    // Start the server's main logic (must be implemented by derived classes)
    virtual void runServer() = 0;
    
    // Virtual destructor to ensure proper cleanup of derived classes.
    virtual ~ISocketServer() = default;
};