#pragma once
#include <string>
#include "IOutputWriter.h"

class SocketOutputWriter : public IOutputWriter {
private:
    int serverSock;
public:
    SocketOutputWriter(int serverSock);
    void writeLine(const std::string& text) override;
};