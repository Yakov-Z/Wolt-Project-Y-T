#include <sys/socket.h>
#include "SocketOutputWriter.h"
#include <vector>
#include <string>
#include <stdexcept>

SocketOutputWriter::SocketOutputWriter(int server) : serverSock(server) {}

void SocketOutputWriter::writeLine(const std::string& text) {
    if(text.empty()) {
        return;
    }

    int bytesSent = 0;
    int totalBytes = text.length();
    const char* buffer = text.c_str();

    while(bytesSent < totalBytes) {
        int bytes = send(serverSock, buffer + bytesSent, totalBytes, 0);
        if(bytes < 0) {
            throw std::runtime_error("Failed to send data: socket error or client disconnected"); 
        }
        bytesSent += bytes;
        totalBytes -= bytes;
    }
}
