#pragma once
#include "ISocketServer.h"

// This class implements a basic TCP server that handles only one client
class SingleSocketServer : public ISocketServer {
private:
    // The port number the server will listen on
    int portNum;
    
    // The file descriptor for the connected client socket (initialized to -1 meaning no connection)
    int clientSock = -1;
public:
    SingleSocketServer(int port);
    
    // Starts the server, binds it to the port, and waits for a single client to connect
    void runServer(); 
    
    // Returns the saved file descriptor of the single connected client
    int getClientSocket();
};