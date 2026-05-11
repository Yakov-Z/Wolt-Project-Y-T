#include <gtest/gtest.h>
#include <thread>
#include <chrono>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include "SingleSocketServer.h"

using namespace std;
// Test 1: Verify that the server successfully binds to the port and listens
TEST(SingleSocketServerTest, BindsAndListensSuccessfully) {
    int testPort = 1234;
    SingleSocketServer server(testPort);

    // Run the server's blocking accept() function in a background thread
    thread serverThread([&server](){
        server.runServer();
    });

    // Give the background thread a short moment to initialize and bind the port
    std::this_thread::sleep_for(std::chrono::milliseconds(100));

    // Create a new independent socket to test if the port is truly occupied
    int duplicateSock = socket(AF_INET, SOCK_STREAM, 0);
    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin)); 
    sin.sin_family = AF_INET;     
    sin.sin_addr.s_addr = INADDR_ANY; 
    sin.sin_port = htons(testPort);
    
    // Attempt to bind to the same port the server is currently using
    int bindResult = bind(duplicateSock, (struct sockaddr *) &sin, sizeof(sin));
    
    // We expect this to fail (return -1) because our server should already own this port
    EXPECT_EQ(bindResult, -1);
    close(duplicateSock);

    // Create a temporary "terminator" client to connect to the server
    // This ensures the server's accept() call is unblocked so the thread can finish cleanly
    int terminatorClient = socket(AF_INET, SOCK_STREAM, 0);
    struct sockaddr_in sin2;
    memset(&sin, 0, sizeof(sin2)); // initialize
    sin2.sin_family = AF_INET; // IPv4
    sin2.sin_addr.s_addr = inet_addr("127.0.0.1"); // IP
    sin2.sin_port = htons(testPort); // dest port
    int connectResult = connect(terminatorClient, (struct sockaddr *) &sin2, sizeof(sin2));
    close(terminatorClient);

    // Wait for the server thread to complete its execution
    serverThread.join();
}

// Test 2: Verify that the server successfully accepts a client and stores its socket descriptor
TEST(SingleSocketServerTest, AcceptsClientConnection) {
    int testPort = 1235;
    SingleSocketServer server(testPort);

    // Run the server in a separate thread so it doesn't block the main test execution
    thread serverThread([&server](){
        server.runServer();
    });

    // Wait briefly to ensure the server is ready to accept connections
    std::this_thread::sleep_for(std::chrono::milliseconds(100));

    // Create a standard client socket for communication
    int client = socket(AF_INET, SOCK_STREAM, 0);
    ASSERT_GE(client, 0);

    // Set up the connection details (pointing to the local server port)
    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin)); // initialize
    sin.sin_family = AF_INET; // IPv4
    sin.sin_addr.s_addr = inet_addr("127.0.0.1"); // IP
    sin.sin_port = htons(testPort); // dest port
    
    // Attempt to connect the client socket to the server
    int connectRes = connect(client, (struct sockaddr *) &sin, sizeof(sin));
    
    // We expect the connection to succeed (return 0)
    EXPECT_EQ(connectRes, 0);

    // Wait for the server thread to process the incoming connection and exit runServer()
    serverThread.join();

    // Verify that the server actually saved a valid client socket (File Descriptor > 0)
    EXPECT_GT(server.getClientSocket(), 0);

    // Clean up by closing the client socket
    close(client);
}