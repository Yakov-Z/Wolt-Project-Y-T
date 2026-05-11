#pragma once
#include "SingleSocketServer.h"
#include <iostream>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>

SingleSocketServer::SingleSocketServer(int port) : portNum(port) {}


int SingleSocketServer::getClientSocket() { return clientSock; }

void SingleSocketServer::runServer() {
    // Create a TCP socket (SOCK_STREAM) for IPv4 (AF_INET)
    // This is the main "listening" socket for the server
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) {
        perror("error creating socket");
    }

    // Initialize the socket address structure
    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin)); // Clear the structure memory
    sin.sin_family = AF_INET;     // IPv4 address family
    sin.sin_addr.s_addr = INADDR_ANY; // Bind to all available interfaces (any local IP)
    sin.sin_port = htons(portNum); // Convert port to network byte order

    // Bind the socket to the specified IP and port
    if (bind(sock, (struct sockaddr *) &sin, sizeof(sin)) < 0) {
        perror("error binding socket");
    }

    // Start listening for incoming connections with backlog of 1
    if (listen(sock, 1) < 0) {
        perror("error listening to a socket");
    }

    // Prepare structure to hold client connection details
    struct sockaddr_in client_sin;
    unsigned int addr_len = sizeof(client_sin);
    
    // Accept an incoming client connection, creating a new socket
    // This function blocks (waits) until a client actually tries to connect
    int client_sock = accept(sock,  (struct sockaddr *) &client_sin,  &addr_len);

    if (client_sock < 0) {
        perror("error accepting client");
    }

    // Save the newly created client socket so other parts of the program can use it
    clientSock = client_sock;
}