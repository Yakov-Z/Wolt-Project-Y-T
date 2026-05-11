#pragma once
#include <string>
#include "IInputReader.h"

// Class that implements the IInputReader to read input from a Socket
class SocketInputReader : public IInputReader {
private:
    // The FD of the client socket, we use it to read input from it
    int clientSock;
    // Stores data that arrived but wasn't a full command yet
    std::string leftoverBuffer;
public:
    SocketInputReader(int clientPort);
    bool hasNext() override;
    std::string readLine() override;
};