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

    thread serverThread([&server](){
        server.runServer();
    });

    std::this_thread::sleep_for(std::chrono::milliseconds(100));

    int duplicateSock = socket(AF_INET, SOCK_STREAM, 0);
    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin)); 
    sin.sin_family = AF_INET;     
    sin.sin_addr.s_addr = INADDR_ANY; 
    sin.sin_port = htons(testPort);
    
    int bindResult = bind(duplicateSock, (struct sockaddr *) &sin, sizeof(sin));
    EXPECT_EQ(bindResult, -1);
    close(duplicateSock);

    int terminatorClient = socket(AF_INET, SOCK_STREAM, 0);
    struct sockaddr_in sin2;
    memset(&sin, 0, sizeof(sin2)); // initialize
    sin2.sin_family = AF_INET; // IPv4
    sin2.sin_addr.s_addr = inet_addr("127.0.0.1"); // IP
    sin2.sin_port = htons(testPort); // dest port
    int connectResult = connect(terminatorClient, (struct sockaddr *) &sin2, sizeof(sin2));
    close(terminatorClient);

    serverThread.join();
}

TEST(SingleSocketServerTest, AcceptsClientConnection) {
    int testPort = 1234;
    SingleSocketServer server(testPort);

    thread serverThread([&server](){
        server.runServer();
    });

    this_thread::sleep_for(chrono::milliseconds(100));

    int client = socket(AF_INET, SOCK_STREAM, 0);
    ASSERT_GE(client, 0);

    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin)); // initialize
    sin.sin_family = AF_INET; // IPv4
    sin.sin_addr.s_addr = inet_addr("127.0.0.1"); // IP
    sin.sin_port = htons(testPort); // dest port
    int connectRes = connect(client, (struct sockaddr *) &sin, sizeof(sin));
    EXPECT_EQ(connectRes, 0);

    serverThread.join();

    EXPECT_GT(server.getClientSocket(), 0);

    close(client);
}

