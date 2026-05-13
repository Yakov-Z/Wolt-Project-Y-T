#include <gtest/gtest.h>
#include <vector>
#include <string>
#include <memory>
#include <thread>
#include <chrono>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <filesystem>

#include "MemoryDataRepository.h"
#include "PostCommand.h"
#include "RecommendCommand.h"
#include "CommonUsersRecommend.h"
#include "ConsoleOutputWriter.h"
#include "SocketOutputWriter.h"
#include "ServerRunner.h"

// Fake persistence mock used strictly for testing the algorithm logic without actual disk I/O
class FakePersistence : public IPersistanceData {
public:
    void saveData(const UserStorageRecord& data) override {} 
    StorageDataList loadAllData() override { return {}; }
    void deleteData(const UserStorageRecord& data) override {}
};

// A silent output writer designed to prevent console clutter during automated testing
class SilentOutputWriter : public IOutputWriter {
public:
    void writeLine(const std::string& message) override {
        // Suppress output
    }  
    virtual ~SilentOutputWriter() = default; 
};

// Algorithm unit test verifying the recommendation logic using isolated memory and a predefined dataset
TEST(IntegrationTest, Exe_Example) {
    
    FakePersistence fake;
    MemoryDataRepository repo(fake);
    SilentOutputWriter writer; 
   
    // Populate the in-memory repository with exercise data to build the user-product graph
    PostCommand(repo, fake, "1",  {"100", "101", "102", "103"}, writer).execute();
    PostCommand(repo, fake, "2",  {"101", "102", "104", "105", "106"}, writer).execute();
    PostCommand(repo, fake, "3",  {"100", "104", "105", "107", "108"}, writer).execute();
    PostCommand(repo, fake, "4",  {"101", "105", "106", "107", "109", "110"}, writer).execute();
    PostCommand(repo, fake, "5",  {"100", "102", "103", "105", "108", "111"}, writer).execute();
    PostCommand(repo, fake, "6",  {"100", "103", "104", "110", "111", "112", "113"}, writer).execute();
    PostCommand(repo, fake, "7",  {"102", "105", "106", "107", "108", "109", "110"}, writer).execute();
    PostCommand(repo, fake, "8",  {"101", "104", "105", "106", "109", "111", "114"}, writer).execute();
    PostCommand(repo, fake, "9",  {"100", "103", "105", "107", "112", "113", "115"}, writer).execute();
    PostCommand(repo, fake, "10", {"100", "102", "105", "106", "107", "109", "110", "116"}, writer).execute();

    // Execute the recommendation algorithm targeting a specific user and product
    CommonUsersRecommend algo(repo, "1", "104");
    std::vector<std::string> recommendations = algo.recommend();

    // Verify the algorithm's output matches the expected sorted results from the exercise instructions
    std::vector<std::string> expected = {
        "105", "106", "111", "110", "112", "113", "107", "108", "109", "114"
    };

    ASSERT_EQ(recommendations.size(), expected.size());
    
    for(size_t i = 0; i < expected.size(); ++i) {
        EXPECT_EQ(recommendations[i], expected[i]);
    }
}

// End-to-end integration test verifying the entire system flow over a real TCP connection
TEST(IntegrationTest, FullSystemFlow) {
    // Erase any existing data file to ensure the test starts with a completely clean state
    std::filesystem::remove("/app/data/users_data.txt");

    int testPort = 777;

    // Launch the full server application within a background detached thread
    std::thread serverThread([testPort]() {
        ServerRunner runner;
        runner.run(testPort);
    });

    // Provide the server thread a brief moment to initialize and bind to the port
    std::this_thread::sleep_for(std::chrono::milliseconds(200));

    // Establish a real TCP client socket and connect it to the local server
    int clientSock = socket(AF_INET, SOCK_STREAM, 0);
    ASSERT_GE(clientSock, 0);

    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = inet_addr("127.0.0.1");
    sin.sin_port = htons(testPort);

    int connectRes = connect(clientSock, (struct sockaddr*)&sin, sizeof(sin));
    ASSERT_EQ(connectRes, 0);

    // Simulate sending the HELP command and evaluate the static response
    std::string command = "HELP\n";
    send(clientSock, command.c_str(), command.length(), 0);

    char buffer[2048] = {0};
    int bytesRead = recv(clientSock, buffer, sizeof(buffer) - 1, 0);
    ASSERT_GT(bytesRead, 0);

    std::string helpText = "DELETE, arguments: [userid] [productid1] [productid2] …  \n"
                           "GET, arguments: [userid] [productid] \n"
                           "PATCH, arguments: [userid] [productid1] [productid2] …  \n"
                           "POST, arguments: [userid] [productid1] [productid2] …  \n"
                           "help\n";
    std::string response(buffer);
    EXPECT_EQ(response, helpText);

    // Simulate user creation and data insertion using POST commands
    command = "post 1 100\n";
    send(clientSock, command.c_str(), command.length(), 0);
    memset(buffer, 0, sizeof(buffer));
    bytesRead = recv(clientSock, buffer, sizeof(buffer) - 1, 0);
    ASSERT_GT(bytesRead, 0);
    response = buffer;
    EXPECT_EQ(response, "201 Created\n");

    command = "poSt 2 100 101\n";
    send(clientSock, command.c_str(), command.length(), 0);
    memset(buffer, 0, sizeof(buffer));
    bytesRead = recv(clientSock, buffer, sizeof(buffer) - 1, 0);
    ASSERT_GT(bytesRead, 0);
    response = buffer;
    EXPECT_EQ(response, "201 Created\n");

    // Simulate requesting recommendations using the GET command
    command = "Get 1 100\n";
    send(clientSock, command.c_str(), command.length(), 0);
    memset(buffer, 0, sizeof(buffer));
    bytesRead = recv(clientSock, buffer, sizeof(buffer) - 1, 0);
    ASSERT_GT(bytesRead, 0);
    response = buffer;
    EXPECT_EQ(response, "200 Ok\n\n101\n");

    // Simulate removing user data and verify the server acknowledges the deletion
    command = "delete 1 100\n";
    send(clientSock, command.c_str(), command.length(), 0);
    memset(buffer, 0, sizeof(buffer));
    bytesRead = recv(clientSock, buffer, sizeof(buffer) - 1, 0);
    ASSERT_GT(bytesRead, 0);
    response = buffer;
    EXPECT_EQ(response, "204 No Content\n");

    // Confirm the previously deleted data yields empty recommendations
    command = "get 1 100\n";
    send(clientSock, command.c_str(), command.length(), 0);
    memset(buffer, 0, sizeof(buffer));
    bytesRead = recv(clientSock, buffer, sizeof(buffer) - 1, 0);
    ASSERT_GT(bytesRead, 0);
    response = buffer;
    EXPECT_EQ(response, "200 Ok\n\n");

    // Simulate an invalid request to ensure the parser correctly handles bad input
    command = "chiko 1000\n";
    send(clientSock, command.c_str(), command.length(), 0);
    memset(buffer, 0, sizeof(buffer));
    bytesRead = recv(clientSock, buffer, sizeof(buffer) - 1, 0);
    ASSERT_GT(bytesRead, 0);
    response = buffer;
    EXPECT_EQ(response, "400 Bad Request\n");

    // Release network resources
    close(clientSock);
    serverThread.detach();
}