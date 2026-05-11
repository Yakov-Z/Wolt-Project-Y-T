#include <sys/socket.h>
#include "SocketInputReader.h"
#include <vector>

SocketInputReader::SocketInputReader(int client_sock) : clientSock(client_sock) {}

bool SocketInputReader::hasNext() {
    // Check if we already have a full command waiting in our buffer
    if (leftoverBuffer.find('\n') != std::string::npos) {
        return true;
    }

    // If not, read from the socket until we get a '\n' or the client disconnects
    while (leftoverBuffer.find('\n') == std::string::npos) {
        std::vector<char> buffer(4096);
        
        // Block and wait for client to send data
        int read_bytes = recv(clientSock, buffer.data(), buffer.size(), 0);
        
        if (read_bytes <= 0) {
            // Client disconnected gracefully or a network error occurred
            return false;
        }
        
        // Append the newly received bytes to our persistent buffer
        leftoverBuffer.append(buffer.data(), read_bytes);
    }
    
    return true;
}

std::string SocketInputReader::readLine() {
    // Locate the '\n' position
    size_t newline_pos = leftoverBuffer.find('\n');
    
    if (newline_pos == std::string::npos) {
        return "";
    }

    // Extract exactly one command up to the newline
    std::string line = leftoverBuffer.substr(0, newline_pos);
    
    // Remove the extracted line and the newline character from the buffer
    leftoverBuffer.erase(0, newline_pos + 1);
    
    // Handle potential Windows-style line endings (\r\n)
    if (!line.empty() && line.back() == '\r') {
        line.pop_back();
    }
    
    return line;
}
