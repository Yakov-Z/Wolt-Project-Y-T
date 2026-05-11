#pragma once
#include "ISocketServer.h"

// Interface for socket servers
class SingleSocketServer : public ISocketServer {
private:
    int portNum;
    int clientSock = -1;
public:
    SingleSocketServer(int port);
    void runServer(); 
    int getClientSocket();
};
